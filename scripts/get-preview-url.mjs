#!/usr/bin/env node
// Robust preview URL discovery: Vercel API -> GitHub Deployments -> Vercel PR comment.
// Writes url.txt and prints the URL to stdout. Exits non-zero with clear message if nothing found.

import assert from "node:assert";
import fs from "node:fs/promises";

const {
  GITHUB_REPOSITORY,
  GITHUB_REF_NAME,
  GITHUB_SHA,
  GITHUB_EVENT_NAME,
  GITHUB_EVENT_PATH,
  GITHUB_RUN_ID,
  GITHUB_TOKEN, // default token provided by Actions
  VERCEL_TOKEN,
  VERCEL_PROJECT_ID,
  VERCEL_ORG_ID, // optional
} = process.env;

const log = (...a) => console.log("[preview-url]", ...a);
const warn = (...a) => console.warn("[preview-url][warn]", ...a);
const err = (...a) => console.error("[preview-url][error]", ...a);

const OWNER = GITHUB_REPOSITORY?.split("/")[0];
const REPO = GITHUB_REPOSITORY?.split("/")[1];

// small helpers
const writeOut = async (url) => {
  await fs.writeFile("url.txt", url.trim() + "\n");
  // also echo for subsequent steps
  console.log(url.trim());
};

const fetchJson = async (url, init = {}) => {
  const res = await fetch(url, init);
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText} for ${url}\n${text}`);
  }
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

async function tryVercelApi() {
  if (!VERCEL_TOKEN || !VERCEL_PROJECT_ID) {
    log("Vercel API: missing VERCEL_TOKEN/VERCEL_PROJECT_ID, skipping.");
    return null;
  }
  const params = new URLSearchParams({
    projectId: VERCEL_PROJECT_ID,
    ...(VERCEL_ORG_ID ? { teamId: VERCEL_ORG_ID } : {}),
    "meta-githubCommitSha": GITHUB_SHA ?? "",
    limit: "1",
  });
  const url = `https://api.vercel.com/v6/deployments?${params}`;
  log("Vercel API: listing deployments for commit…");
  try {
    const data = await fetchJson(url, {
      headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
    });
    const d = data?.deployments?.[0];
    if (!d?.url) return null;
    const preview = d.url.startsWith("http") ? d.url : `https://${d.url}`;
    log("Vercel API: found", preview);
    return preview;
  } catch (e) {
    warn("Vercel API failed:", e.message);
    return null;
  }
}

async function tryGithubDeployments() {
  if (!GITHUB_TOKEN || !OWNER || !REPO) {
    log("GitHub deployments: missing token or repo context, skipping.");
    return null;
  }
  // Get latest deployment for this SHA & environment=Preview
  const headers = {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
  };
  const depUrl = `https://api.github.com/repos/${OWNER}/${REPO}/deployments?sha=${GITHUB_SHA}`;
  try {
    const deployments = await fetchJson(depUrl, { headers });
    const d =
      deployments?.find((x) =>
        (x.environment || "").toLowerCase().includes("preview"),
      ) || deployments?.[0];
    if (!d) return null;

    const statusesUrl = `https://api.github.com/repos/${OWNER}/${REPO}/deployments/${d.id}/statuses`;
    const statuses = await fetchJson(statusesUrl, { headers });
    const s = statuses?.find((x) => x.environment_url) || statuses?.[0];
    const url =
      s?.environment_url || d?.original_environment_url || d?.environment_url;
    if (url) {
      log("GitHub deployments: found", url);
      return url;
    }
    return null;
  } catch (e) {
    warn("GitHub deployments failed:", e.message);
    return null;
  }
}

async function tryVercelComment() {
  // For pull_request, scan comments for vercel[bot] and extract URL
  if (
    !GITHUB_TOKEN ||
    !OWNER ||
    !REPO ||
    GITHUB_EVENT_NAME !== "pull_request"
  ) {
    log("Vercel PR comment: not a PR or missing token, skipping.");
    return null;
  }
  let prNumber;
  try {
    const evt = JSON.parse(await fs.readFile(GITHUB_EVENT_PATH, "utf8"));
    prNumber = evt?.number ?? evt?.pull_request?.number;
  } catch {
    // ignore
  }
  if (!prNumber) return null;

  const headers = {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
  };
  const commentsUrl = `https://api.github.com/repos/${OWNER}/${REPO}/issues/${prNumber}/comments?per_page=50`;
  try {
    const comments = await fetchJson(commentsUrl, { headers });
    const vercelComment = [...comments]
      .reverse()
      .find((c) => (c.user?.login || "").toLowerCase().includes("vercel"));
    if (!vercelComment?.body) return null;

    const m = vercelComment.body.match(/https?:\/\/[^\s)]+vercel\.app[^\s)]*/i);
    if (m?.[0]) {
      log("Vercel PR comment: found", m[0]);
      return m[0];
    }
    return null;
  } catch (e) {
    warn("Vercel PR comment search failed:", e.message);
    return null;
  }
}

(async () => {
  try {
    const candidates = [
      await tryVercelApi(),
      await tryGithubDeployments(),
      await tryVercelComment(),
    ].filter(Boolean);

    const url = candidates[0];
    if (!url) {
      err(
        "Could not resolve Preview URL.\n" +
          "- Ensure the PR has a Vercel Preview deployment.\n" +
          "- Provide VERCEL_TOKEN + VERCEL_PROJECT_ID for the fastest lookup.\n" +
          "- The GitHub token must have 'deployments:read' permission.",
      );
      process.exit(2);
    }

    await writeOut(url);
    log("Preview URL:", url);
    // Also export to GITHUB_ENV if available
    if (process.env.GITHUB_ENV) {
      await fs.appendFile(process.env.GITHUB_ENV, `BASE_URL=${url}\n`);
      log("Exported BASE_URL for subsequent steps.");
    }
  } catch (e) {
    err("Unhandled error:", e);
    process.exit(1);
  }
})();

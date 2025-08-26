#!/usr/bin/env node
// Resolve Vercel preview URL with retry/backoff. Falls back to GitHub deployment API
// and exits successfully even if no preview is found.

import fs from "node:fs/promises";

const {
  GITHUB_REPOSITORY,
  GITHUB_SHA,
  GITHUB_TOKEN,
  VERCEL_TOKEN,
  VERCEL_PROJECT_ID,
  VERCEL_ORG_ID,
  GITHUB_ENV,
} = process.env;

const log = (...a) => console.log("[vercel-preview]", ...a);
const warn = (...a) => console.warn("[vercel-preview][warn]", ...a);

const [OWNER, REPO] = GITHUB_REPOSITORY?.split("/") ?? [];

async function fetchJson(url, init = {}) {
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
}

async function tryVercelApi() {
  if (!VERCEL_TOKEN || !VERCEL_PROJECT_ID) return null;
  const params = new URLSearchParams({
    projectId: VERCEL_PROJECT_ID,
    ...(VERCEL_ORG_ID ? { teamId: VERCEL_ORG_ID } : {}),
    "meta-githubCommitSha": GITHUB_SHA ?? "",
    limit: "1",
  });
  const url = `https://api.vercel.com/v6/deployments?${params}`;
  try {
    const data = await fetchJson(url, {
      headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
    });
    const d = data?.deployments?.[0];
    if (!d?.url) return null;
    const preview = d.url.startsWith("http") ? d.url : `https://${d.url}`;
    log("Vercel API: found", preview);
    return { url: preview, source: "vercel" };
  } catch (e) {
    warn("Vercel API failed:", e.message);
    return null;
  }
}

async function tryGithubDeployments() {
  if (!GITHUB_TOKEN || !OWNER || !REPO) return null;
  const headers = {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
  };
  const depUrl = `https://api.github.com/repos/${OWNER}/${REPO}/deployments?sha=${GITHUB_SHA}`;
  try {
    const deployments = await fetchJson(depUrl, { headers });
    const d = deployments?.[0];
    if (!d) return null;
    const statusesUrl = `https://api.github.com/repos/${OWNER}/${REPO}/deployments/${d.id}/statuses`;
    const statuses = await fetchJson(statusesUrl, { headers });
    const s = statuses?.find((x) => x.environment_url) || statuses?.[0];
    const url =
      s?.environment_url || d?.original_environment_url || d?.environment_url;
    if (url) {
      log("GitHub API: found", url);
      return { url, source: "github" };
    }
    return null;
  } catch (e) {
    warn("GitHub API failed:", e.message);
    return null;
  }
}

async function resolvePreview() {
  return (await tryVercelApi()) || (await tryGithubDeployments());
}

async function main() {
  const maxAttempts = 5;
  let result = null;
  for (let i = 1; i <= maxAttempts; i++) {
    result = await resolvePreview();
    if (result) break;
    log(`Preview not ready, retrying in ${i * 2}s (${i}/${maxAttempts})`);
    await new Promise((r) => setTimeout(r, i * 2000));
  }

  if (!result) {
    log("No preview URL found. Skipping.");
    return;
  }

  await fs.writeFile("url.txt", result.url.trim() + "\n");
  log(`Preview URL resolved via ${result.source}: ${result.url}`);
  if (GITHUB_ENV) {
    await fs.appendFile(GITHUB_ENV, `BASE_URL=${result.url}\n`);
    log("Exported BASE_URL for subsequent steps.");
  }
}

main().catch((e) => {
  warn("Unhandled error:", e.message);
});

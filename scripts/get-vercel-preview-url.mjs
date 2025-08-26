#!/usr/bin/env node
// Resolve Vercel preview URL with retries and fallbacks.

import fs from "node:fs/promises";

const {
  GITHUB_REPOSITORY,
  GITHUB_SHA,
  GITHUB_TOKEN,
  VERCEL_TOKEN,
  VERCEL_PROJECT_ID,
  VERCEL_ORG_ID,
  GITHUB_ENV,
  GITHUB_EVENT_PATH,
  GITHUB_REF,
} = process.env;

const [OWNER, REPO] = GITHUB_REPOSITORY?.split("/") ?? [];

async function fetchJson(url, init = {}) {
  try {
    const res = await fetch(url, init);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
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
  const data = await fetchJson(url, {
    headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
  });
  const d = data?.deployments?.[0];
  if (!d?.url) return null;
  const preview = d.url.startsWith("http") ? d.url : `https://${d.url}`;
  return { url: preview, source: "vercel" };
}

async function tryGithubDeployments() {
  if (!GITHUB_TOKEN || !OWNER || !REPO) return null;
  const headers = {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
  };
  const depUrl = `https://api.github.com/repos/${OWNER}/${REPO}/deployments?sha=${GITHUB_SHA}`;
  const deployments = await fetchJson(depUrl, { headers });
  const d = deployments?.[0];
  if (!d) return null;
  const statusesUrl = `https://api.github.com/repos/${OWNER}/${REPO}/deployments/${d.id}/statuses`;
  const statuses = await fetchJson(statusesUrl, { headers });
  const s = statuses?.find((x) => x.environment_url) || statuses?.[0];
  const url =
    s?.environment_url || d?.original_environment_url || d?.environment_url;
  return url ? { url, source: "github" } : null;
}

async function getPrNumber() {
  const m = GITHUB_REF?.match(/refs\/pull\/(\d+)\/merge/);
  if (m) return m[1];
  if (GITHUB_EVENT_PATH) {
    try {
      const txt = await fs.readFile(GITHUB_EVENT_PATH, "utf8");
      const evt = JSON.parse(txt);
      return evt.pull_request?.number;
    } catch {}
  }
  return null;
}

async function tryPrComments() {
  const pr = await getPrNumber();
  if (!pr || !GITHUB_TOKEN || !OWNER || !REPO) return null;
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/issues/${pr}/comments`;
  const comments = await fetchJson(url, {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
    },
  });
  for (const c of comments || []) {
    const match = c.body?.match(/https?:\/\/[^\s]+vercel.app/);
    if (match) return { url: match[0], source: "comment" };
  }
  return null;
}

async function resolvePreview() {
  return (
    (await tryVercelApi()) ||
    (await tryGithubDeployments()) ||
    (await tryPrComments())
  );
}

async function main() {
  const delays = [2000, 4000, 6000, 8000, 10000, 12000];
  let result = null;
  for (let i = 0; i < delays.length; i++) {
    result = await resolvePreview();
    if (result) break;
    if (i < delays.length - 1)
      await new Promise((r) => setTimeout(r, delays[i]));
  }
  if (!result) return;
  await fs.writeFile("url.txt", result.url.trim() + "\n");
  if (GITHUB_ENV) {
    await fs.appendFile(GITHUB_ENV, `BASE_URL=${result.url}\n`);
  }
  console.log(`[vercel-preview] ${result.url}`);
}

main();

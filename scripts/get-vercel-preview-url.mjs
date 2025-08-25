/* eslint-disable no-console */
import assert from 'node:assert';

const {
  VERCEL_TOKEN,
  VERCEL_PROJECT_ID,
  VERCEL_ORG_ID,        // optional
  GITHUB_SHA,           // provided by Actions
} = process.env;

assert(!!VERCEL_TOKEN, 'missing env: VERCEL_TOKEN');
assert(!!VERCEL_PROJECT_ID, 'missing env: VERCEL_PROJECT_ID');

const API = 'https://api.vercel.com';

async function fetchJSON(url, init = {}) {
  const res = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${VERCEL_TOKEN}`,
      ...(init.headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Vercel API ${res.status}: ${text}`);
  }
  return res.json();
}

async function resolveOrgId() {
  if (VERCEL_ORG_ID) return VERCEL_ORG_ID;
  // Infer org/account by reading the project
  const proj = await fetchJSON(`${API}/v9/projects/${encodeURIComponent(VERCEL_PROJECT_ID)}`);
  return proj.accountId;
}

async function findDeployment(orgId) {
  const params = new URLSearchParams({
    projectId: VERCEL_PROJECT_ID,
    target: 'preview',
    limit: '20',
  });
  const data = await fetchJSON(`${API}/v13/deployments?${params.toString()}&teamId=${orgId}`);

  // Prefer current commit
  let dep = data.deployments?.find(d => d.meta?.githubCommitSha === GITHUB_SHA);
  if (!dep) dep = data.deployments?.[0];
  return dep || null;
}

async function waitForReady(depId, orgId, timeoutMs = 5 * 60 * 1000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const dep = await fetchJSON(`${API}/v13/deployments/${depId}?teamId=${orgId}`);
    if (dep.readyState === 'READY' && dep.url) return dep.url.startsWith('http') ? dep.url : `https://${dep.url}`;
    if (dep.readyState === 'ERROR' || dep.state === 'ERROR') throw new Error('deployment entered ERROR state');
    await new Promise(r => setTimeout(r, 5000));
  }
  throw new Error('timeout waiting for deployment to be READY');
}

(async () => {
  const orgId = await resolveOrgId();

  // Poll for a deployment to exist for this commit
  let dep = null;
  const start = Date.now();
  while (!dep && Date.now() - start < 5 * 60 * 1000) {
    dep = await findDeployment(orgId);
    if (!dep) await new Promise(r => setTimeout(r, 5000));
  }
  if (!dep) throw new Error('deployment not found');

  const url = await waitForReady(dep.uid || dep.id, orgId);
  process.stdout.write(url);
})();

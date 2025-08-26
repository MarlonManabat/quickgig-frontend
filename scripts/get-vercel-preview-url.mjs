import { setTimeout as sleep } from 'node:timers/promises';

const {
  VERCEL_TOKEN,
  VERCEL_PROJECT_ID,
  VERCEL_ORG_ID,
  GITHUB_SHA,
  GITHUB_EVENT_NAME,
  NEXT_PUBLIC_SITE_URL,
} = process.env;

if (!VERCEL_TOKEN || !VERCEL_PROJECT_ID) {
  console.error('Missing VERCEL_TOKEN or VERCEL_PROJECT_ID env vars.');
  process.exit(1);
}

if (GITHUB_EVENT_NAME === 'push') {
  if (NEXT_PUBLIC_SITE_URL) {
    console.log(NEXT_PUBLIC_SITE_URL);
    process.exit(0);
  }
  console.error('NEXT_PUBLIC_SITE_URL required for push events');
  process.exit(1);
}

const params = new URLSearchParams({ projectId: VERCEL_PROJECT_ID, limit: '20' });
if (VERCEL_ORG_ID) params.set('teamId', VERCEL_ORG_ID);
const apiUrl = `https://api.vercel.com/v13/deployments?${params}`;

const end = Date.now() + 5 * 60 * 1000;
let delay = 5000;

while (Date.now() < end) {
  const res = await fetch(apiUrl, {
    headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
  });
  if (res.status === 400 || res.status === 404) {
    await sleep(delay);
    delay = Math.min(delay + 5000, 15000);
    continue;
  }
  if (!res.ok) {
    console.error(`Vercel API error: ${res.status} ${res.statusText}`);
    process.exit(1);
  }
  const data = await res.json();
  const deployments = (data.deployments || []).filter(
    (d) => d.meta?.githubCommitSha === GITHUB_SHA,
  );
  const deployment = deployments.find((d) => d.readyState === 'READY');
  if (deployment) {
    console.log(`https://${deployment.url}`);
    process.exit(0);
  }
  await sleep(delay);
  delay = Math.min(delay + 5000, 15000);
}

console.error('Timed out waiting for Vercel deployment to be ready');
process.exit(1);

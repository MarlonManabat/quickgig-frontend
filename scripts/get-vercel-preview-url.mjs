import { writeFile } from 'node:fs/promises';

const {
  VERCEL_TOKEN,
  VERCEL_PROJECT_ID,
  VERCEL_ORG_ID,
  GITHUB_SHA,
  GITHUB_REF,
} = process.env;

if (!VERCEL_TOKEN) {
  console.error('Missing VERCEL_TOKEN');
  process.exit(1);
}
if (!VERCEL_PROJECT_ID) {
  console.error('Missing VERCEL_PROJECT_ID');
  process.exit(1);
}

const commitSha = GITHUB_SHA;
const commitRef = GITHUB_REF?.split('/').pop();

const params = new URLSearchParams({ projectId: VERCEL_PROJECT_ID, limit: '20' });
if (VERCEL_ORG_ID) params.set('teamId', VERCEL_ORG_ID);

const apiUrl = `https://api.vercel.com/v13/deployments?${params}`;
const maxAttempts = 60; // 10 minutes

for (let attempt = 1; attempt <= maxAttempts; attempt++) {
  const res = await fetch(apiUrl, {
    headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
  });
  if (!res.ok) {
    console.error(`Vercel API error: ${res.status} ${res.statusText}`);
    process.exit(1);
  }
  const data = await res.json();
  const deployments = (data.deployments || [])
    .filter(
      (d) =>
        d.meta?.githubCommitSha === commitSha ||
        d.meta?.githubCommitRef === commitRef,
    )
    .sort((a, b) => (b.createdAt ?? b.created ?? 0) - (a.createdAt ?? a.created ?? 0));
  const deployment = deployments.find((d) =>
    ['READY', 'SUCCEEDED'].includes(d.readyState),
  );
  if (deployment) {
    const finalUrl = `https://${deployment.url}`;
    await writeFile('url.txt', finalUrl);
    console.log(finalUrl);
    process.exit(0);
  }
  await new Promise((r) => setTimeout(r, 10_000));
}

console.error('Timed out waiting for Vercel deployment to be ready');
process.exit(1);

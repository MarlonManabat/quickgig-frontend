import { writeFile } from 'node:fs/promises';

const required = ['VERCEL_TOKEN', 'VERCEL_PROJECT_ID'];
for (const key of required) {
  if (!process.env[key]) {
    console.error(`Missing ${key}`);
    process.exit(1);
  }
}

const {
  VERCEL_TOKEN,
  VERCEL_PROJECT_ID,
  VERCEL_ORG_ID,
  GITHUB_SHA,
  GITHUB_REF,
} = process.env;

const commitSha = GITHUB_SHA;
const commitRef = GITHUB_REF?.split('/').pop();

const params = new URLSearchParams({ projectId: VERCEL_PROJECT_ID, limit: '20' });
if (VERCEL_ORG_ID) params.set('teamId', VERCEL_ORG_ID);

const apiUrl = `https://api.vercel.com/v13/deployments?${params}`;
const maxAttempts = 5;

async function fetchDeployments() {
  const res = await fetch(apiUrl, {
    headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
  });
  if (res.status === 400) {
    throw new Error(
      'Vercel API returned 400. Check VERCEL_TOKEN, VERCEL_PROJECT_ID and VERCEL_ORG_ID.',
    );
  }
  if (!res.ok) {
    throw new Error(`Vercel API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

for (let attempt = 1; attempt <= maxAttempts; attempt++) {
  try {
    const data = await fetchDeployments();
    const deployments = (data.deployments || [])
      .filter(
        (d) =>
          d.meta?.githubCommitSha === commitSha ||
          d.meta?.githubCommitRef === commitRef,
      )
      .sort(
        (a, b) => (b.createdAt ?? b.created ?? 0) - (a.createdAt ?? a.created ?? 0),
      );
    const deployment = deployments.find((d) =>
      ['READY', 'SUCCEEDED'].includes(d.readyState),
    );
    if (deployment) {
      const finalUrl = `https://${deployment.url}`;
      await writeFile('url.txt', finalUrl);
      console.log(finalUrl);
      process.exit(0);
    }
    if (attempt === maxAttempts) {
      console.error('Preview deployment not found or not ready');
      process.exit(1);
    }
  } catch (err) {
    console.error(err.message);
    if (attempt === maxAttempts) {
      process.exit(1);
    }
  }
  await new Promise((r) => setTimeout(r, 10_000));
}

console.error('Timed out waiting for Vercel deployment to be ready');
process.exit(1);

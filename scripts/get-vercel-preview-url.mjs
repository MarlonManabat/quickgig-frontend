const need = ['VERCEL_TOKEN', 'VERCEL_PROJECT_ID'];
const missing = need.filter((k) => !process.env[k]);
if (missing.length) {
  console.error(
    `[get-vercel-preview-url] Missing required env(s): ${missing.join(', ')}`
  );
  process.exit(1);
}
const token = process.env.VERCEL_TOKEN;
const projectId = process.env.VERCEL_PROJECT_ID;
const teamId = process.env.VERCEL_TEAM_ID || '';
const sha = process.env.GITHUB_SHA;

const url = new URL(
  `https://api.vercel.com/v6/deployments?limit=1&projectId=${projectId}&meta-githubCommitSha=${sha}`
);
if (teamId) url.searchParams.set('teamId', teamId);
const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
const json = await res.json();
const deployment = json.deployments?.[0];
if (!deployment?.url) throw new Error('deployment not found');
const full = `https://${deployment.url}`;
console.log(full);

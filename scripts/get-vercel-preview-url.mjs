import assert from 'node:assert';

const token = process.env.VERCEL_TOKEN;
const project = process.env.VERCEL_PROJECT_ID;
const org = process.env.VERCEL_ORG_ID;
const sha = process.env.GITHUB_SHA;

assert(token && project && org && sha, 'missing env');

const url = new URL(`https://api.vercel.com/v6/deployments?limit=1&projectId=${project}&teamId=${org}&meta-githubCommitSha=${sha}`);
const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
const json = await res.json();
const deployment = json.deployments?.[0];
if (!deployment?.url) throw new Error('deployment not found');
console.log(`https://${deployment.url}`);

// Prints https://<preview-url> for the current commit.
// Requires secrets: VERCEL_TOKEN, VERCEL_PROJECT_ID
const token = process.env.VERCEL_TOKEN;
const projectId = process.env.VERCEL_PROJECT_ID;
const sha = process.env.GITHUB_SHA;

if (!token || !projectId) {
  console.error('Missing VERCEL_TOKEN or VERCEL_PROJECT_ID');
  process.exit(1);
}

const res = await fetch(`https://api.vercel.com/v6/deployments?projectId=${projectId}&limit=50`, {
  headers: { Authorization: `Bearer ${token}` },
});
if (!res.ok) {
  console.error('Vercel API error', await res.text());
  process.exit(1);
}
const { deployments = [] } = await res.json();
const match =
  deployments.find(d => d.meta?.githubCommitSha === sha) ||
  deployments.find(d => d.meta?.githubPrId === process.env.PR_NUMBER) ||
  deployments[0];

if (!match) {
  console.error('No preview deployment found for this commit');
  process.exit(1);
}
console.log(`https://${match.url}`);

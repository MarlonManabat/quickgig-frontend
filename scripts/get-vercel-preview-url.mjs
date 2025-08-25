#!/usr/bin/env node
import { setTimeout as wait } from 'node:timers/promises';
import { writeFileSync } from 'node:fs';

const token = process.env.VERCEL_TOKEN;
const projectId = process.env.VERCEL_PROJECT_ID;
const commit = process.env.GITHUB_SHA ?? process.argv[2];

if (!token || !projectId || !commit) {
  console.error('VERCEL_TOKEN, VERCEL_PROJECT_ID, and GITHUB_SHA are required');
  process.exit(1);
}

const API = 'https://api.vercel.com/v6/deployments';
const POLL_INTERVAL = 5000;
const TIMEOUT = 8 * 60 * 1000;
const end = Date.now() + TIMEOUT;

async function fetchDeployment() {
  const url = `${API}?projectId=${projectId}&meta-gitCommitSha=${commit}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error(`Vercel API error: ${res.status}`);
  }
  const json = await res.json();
  return json.deployments?.[0];
}

(async () => {
  while (Date.now() < end) {
    try {
      const dep = await fetchDeployment();
      if (dep) {
        const state = dep.state;
        if (state === 'READY') {
          const url = dep.url.startsWith('http') ? dep.url : `https://${dep.url}`;
          writeFileSync('url.txt', url);
          console.log('Deployment ready:', url);
          return;
        }
        if (state === 'CANCELED' || state === 'ERROR') {
          console.error(`deployment ${state.toLowerCase()}`);
          process.exit(1);
        }
        // QUEUED or BUILDING - just wait
      }
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
    await wait(POLL_INTERVAL);
  }
  console.error('deployment not found (timeout)');
  process.exit(1);
})();

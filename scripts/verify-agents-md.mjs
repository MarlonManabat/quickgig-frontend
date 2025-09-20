#!/usr/bin/env node
import { readFileSync, existsSync } from 'node:fs';

const path = 'agents.md';
if (!existsSync(path)) {
  console.error(`agents.md not found at repo root`);
  process.exit(1);
}

const s = readFileSync(path, 'utf8');

const must = [
  /##\s*Contract/i,
  /##\s*Canonical selectors/i,
  /##\s*CI rules/i,
  /nav-browse-jobs/,
  /nav-login/,
  /nav-my-applications/,
  /nav-post-job/,
  /nav-menu-button/,
  /nav-menu/,
  /jobs-list/,
  /job-card/,
  /apply-button/,
  /(applications-list|applications-empty)/,
  /post-job-skeleton/,
];

const missing = must.filter((re) => !re.test(s));
if (missing.length) {
  console.error('agents.md is missing required content:', missing.map(String));
  process.exit(1);
}

console.log('agents.md contract verified ✅');

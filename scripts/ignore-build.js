#!/usr/bin/env node
/**
 * Vercel Ignored Build Step — return 0 to SKIP deploy, 1 to proceed.
 * Never throws; defaults to proceed if uncertain (to avoid skipping real changes).
 *
 * Skip when ONLY docs/CI/tests/workflows changed, or commit message requests skip.
 */

const { execSync } = require('node:child_process');
const path = require('node:path');

function safeLog(msg) { process.stdout.write(`[ignore-build] ${msg}\n`); }

try {
  const msg = process.env.VERCEL_GIT_COMMIT_MESSAGE || '';
  if (/\[(skip deploy|docs|chore-ci)\]/i.test(msg)) {
    safeLog(`Skipping due to commit tag: "${msg}"`);
    process.exit(0);
  }

  // Determine diff range
  const a = process.env.VERCEL_GIT_PREVIOUS_SHA || '';
  const b = process.env.VERCEL_GIT_COMMIT_SHA || '';
  let out = '';
  try {
    if (a && b) out = execSync(`git diff --name-only ${a} ${b}`, { stdio: ['ignore','pipe','ignore'] }).toString();
    else out = execSync(`git diff --name-only HEAD~1`, { stdio: ['ignore','pipe','ignore'] }).toString();
  } catch {
    // Fall back to "proceed"
    safeLog('No git diff available; proceeding.');
    process.exit(1);
  }

  const changed = out.split('\n').map(s => s.trim()).filter(Boolean);
  if (!changed.length) {
    safeLog('No changed files; skipping.');
    process.exit(0);
  }

  // Paths that require a deploy
  const IMPACT = [
    'src/', 'app/', 'components/', 'lib/', 'public/',
    'next.config', 'package.json', 'pnpm-workspace.yaml', 'package-lock.json', 'pnpm-lock.yaml',
    'tsconfig', 'vercel.json', 'supabase/', 'prisma/'
  ];

  // Safe paths (docs/ci/tests) — if ALL changes are in these, skip
  const SAFE = [
    'docs/', '.github/', 'tests/', 'playwright.', 'CHANGELOG', 'README', 'LICENSE',
    'scripts/ci/', '.vscode/', '.idea/', '.prettierrc', '.eslintrc', '.env', '.env.'
  ];

  const isImpact = (f) => IMPACT.some(p => f.startsWith(p) || f.includes(p));
  const isSafe   = (f) => SAFE.some(p => f.startsWith(p) || f.includes(p))
                       || /\.(md|mdx|png|jpg|svg|gif|yml|yaml)$/.test(f);

  const anyImpact = changed.some(isImpact);
  const allSafe   = changed.every(isSafe);

  if (!anyImpact && allSafe) {
    safeLog(`Only safe paths changed (${changed.length} files); skipping.`);
    process.exit(0);
  }

  safeLog(`App-impacting changes detected; proceeding.`);
  process.exit(1);
} catch (e) {
  // On error, TO BE SAFE: proceed (do not skip a real deploy).
  safeLog(`Error in ignore script; proceeding. ${e?.message || e}`);
  process.exit(1);
}

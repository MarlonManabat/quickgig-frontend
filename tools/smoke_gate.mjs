#!/usr/bin/env node
// Decides whether to run smoke tests after build.
// - Skips on Vercel (preview/prod) unless RUN_SMOKE=1
// - Only runs smoke if SMOKE_BASE_URL (or local default) responds

import { spawn } from 'node:child_process';

const {
  VERCEL,           // defined by Vercel
  VERCEL_ENV,       // 'preview' | 'production' | 'development'
  CI,
  RUN_SMOKE,        // set to '1' to force running smoke
  SMOKE_BASE_URL,
  SMOKE_TIMEOUT_MS = '5000',
} = process.env;

const isVercel = !!VERCEL;
const onVercelBuild = isVercel && (VERCEL_ENV === 'preview' || VERCEL_ENV === 'production');

// Default: skip on Vercel builds unless explicitly enabled
if (onVercelBuild && RUN_SMOKE !== '1') {
  console.log('[smoke-gate] Skipping smoke on Vercel build (set RUN_SMOKE=1 to enable).');
  process.exit(0);
}

// Choose base URL
const base = SMOKE_BASE_URL || 'http://127.0.0.1:3000';

async function reachable(url, timeoutMs) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: ctl.signal, cache: 'no-store' });
    clearTimeout(t);
    return !!res.ok || res.status >= 200;
  } catch {
    return false;
  }
}

const ok = await reachable(base, Number(SMOKE_TIMEOUT_MS));
if (!ok) {
  if (RUN_SMOKE === '1') {
    console.error(`[smoke-gate] RUN_SMOKE=1 but ${base} is not reachable. Failing build.`);
    process.exit(1);
  } else {
    console.log(`[smoke-gate] ${base} not reachable; skipping smoke.`);
    process.exit(0);
  }
}

console.log(`[smoke-gate] Running smoke against ${base} ...`);
const child = spawn('npm', ['run', 'smoke'], { stdio: 'inherit', shell: process.platform === 'win32' });
child.on('exit', (code) => process.exit(code ?? 1));


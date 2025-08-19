#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';

const {
  VERCEL,
  VERCEL_ENV,        // 'preview' | 'production' | 'development'
  CI,
  RUN_SMOKE,         // set to '1' to force on CI/Vercel
  SMOKE_BASE_URL,
  SMOKE_TIMEOUT_MS = '5000',
} = process.env;

const isCI = CI === 'true' || !!VERCEL;
const isVercel = !!VERCEL;
const isVercelPreview = isVercel && VERCEL_ENV === 'preview';
const isVercelProd = isVercel && VERCEL_ENV === 'production';

// 1) Default behavior: SKIP on Vercel builds unless explicitly enabled
if (isVercel && RUN_SMOKE !== '1') {
  console.log('[smoke-gate] Skipping smoke on Vercel (set RUN_SMOKE=1 to enable).');
  process.exit(0);
}

// 2) Decide base URL
let base = SMOKE_BASE_URL;
if (!base) {
  // local default (only meaningful when you run smoke yourself)
  base = 'http://127.0.0.1:3000';
}

// 3) Reachability probe (fail closed ONLY when we intended to run smoke)
const timeoutMs = Number(SMOKE_TIMEOUT_MS);
const controller = new AbortController();
const t = setTimeout(() => controller.abort(), timeoutMs);

async function probe(url) {
  try {
    const res = await fetch(url, { signal: controller.signal, cache: 'no-store' });
    clearTimeout(t);
    return !!res.ok || res.status >= 200;
  } catch {
    return false;
  }
}
const reachable = await probe(base);

if (!reachable) {
  if (RUN_SMOKE === '1') {
    console.error(`[smoke-gate] RUN_SMOKE=1 but ${base} is not reachable. Failing.`);
    process.exit(1);
  } else {
    console.log(`[smoke-gate] ${base} not reachable; skipping smoke.`);
    process.exit(0);
  }
}

// 4) Actually run our smoke script chain
console.log(`[smoke-gate] Running smoke against ${base} ...`);
const child = spawn('npm', ['run', 'smoke'], { stdio: 'inherit', shell: process.platform === 'win32' });
child.on('exit', (code) => process.exit(code ?? 1));

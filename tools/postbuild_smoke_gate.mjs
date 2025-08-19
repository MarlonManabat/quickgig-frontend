#!/usr/bin/env node
const isVercel = !!process.env.VERCEL;
const env = process.env.VERCEL_ENV || 'unknown';
if (isVercel) {
  console.log(`[postbuild] skip smoke on Vercel build (${env})`);
  process.exit(0);
}
if (process.env.RUN_SMOKE !== '1') {
  console.log('[postbuild] skip smoke: RUN_SMOKE!=1');
  process.exit(0);
}
const { spawn } = await import('node:child_process');
const base = process.env.SMOKE_BASE_URL || 'http://127.0.0.1:3000';
process.env.SMOKE_BASE_URL = base;
spawn('npm', ['run', 'smoke'], { stdio: 'inherit', env: process.env }).on('exit',
  (c) => process.exit(c ?? 1)
);

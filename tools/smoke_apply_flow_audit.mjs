#!/usr/bin/env node
import { spawnSync } from 'node:child_process';

if (process.env.NEXT_PUBLIC_ENABLE_APPLY_FLOW_AUDIT !== 'true') {
  console.log('skipped');
  process.exit(0);
}

const base = process.env.SMOKE_BASE_URL || process.env.SMOKE_URL || process.env.BASE || 'http://localhost:3000';
const env = {
  ...process.env,
  BASE: base,
  ENGINE_MODE: 'mock',
  NEXT_PUBLIC_ENABLE_APPLY_FLOW_AUDIT: 'true',
};

const result = spawnSync(
  'npx',
  ['playwright', 'test', 'tests/applyFlowHappyPath.spec.ts', '--config=playwright.config.ts'],
  { stdio: 'inherit', env },
);

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

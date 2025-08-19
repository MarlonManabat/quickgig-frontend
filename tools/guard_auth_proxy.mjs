#!/usr/bin/env node
import { glob } from 'node:fs/promises';
import fs from 'node:fs/promises';

const files = [];
for await (const f of glob('src/**/*.{ts,tsx,js,jsx}')) {
  if (f.startsWith('src/app/api/')) continue;
  if (f === 'src/app/_components/AuthIntercept.tsx') continue;
  files.push(f);
}
const offenders = [];
const re = /(https?:\/\/[^"'\s]*quickgig\.ph\/(login|register)\.php|\/(login|register)\.php)/i;

for (const f of files) {
  const text = await fs.readFile(f, 'utf8');
  if (re.test(text)) offenders.push(f);
}

if (offenders.length) {
  console.error('\n[guard] Client references to PHP auth endpoints found. Use /api/session/* instead:\n');
  offenders.forEach((f) => console.error(' -', f));
  process.exit(1);
} else {
  console.log('[guard] OK: no direct PHP auth endpoints in client code.');
}

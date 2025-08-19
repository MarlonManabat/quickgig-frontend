#!/usr/bin/env node
import { glob } from 'tinyglobby';
import fs from 'node:fs/promises';

const files = await glob(['src/**/*.{ts,tsx,js,jsx}','!src/app/api/**']);
const offenders = [];
const re = /(https?:\/\/[^"'\s]*quickgig\.ph\/(login|register)\.php|\/(login|register)\.php)/i;

for (const f of files) {
  const text = await fs.readFile(f, 'utf8');
  if (re.test(text)) offenders.push(f);
}

if (offenders.length) {
  console.error('\n[guard] Found client references to PHP auth endpoints. Use /api/session/* instead:\n');
  offenders.forEach((f) => console.error(' -', f));
  process.exit(1);
} else {
  console.log('[guard] OK: no direct PHP auth endpoints in client code.');
}

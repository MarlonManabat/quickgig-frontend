#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';

const files = [
  'LICENSE',
  'agreements/NOTICE',
  'agreements/THIRD_PARTY_NOTICES.md',
];

const missing = files.filter((file) => !existsSync(file));
if (missing.length) {
  console.error(`Missing required agreement files: ${missing.join(', ')}`);
  process.exit(1);
}

const notice = readFileSync('agreements/NOTICE', 'utf8').trim();
if (!notice.length) {
  console.error('agreements/NOTICE is empty');
  process.exit(1);
}

console.log('Agreements audit passed ✅');

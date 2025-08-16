#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const fragments = [
  'public/legacy/index.fragment.html',
  'public/legacy/login.fragment.html',
];
let errors = [];
for (const f of fragments) {
  const full = path.join(root, f);
  if (!fs.existsSync(full)) continue;
  const html = fs.readFileSync(full, 'utf8');
  if (/<script\b/i.test(html)) {
    errors.push(`❌ ${f} contains <script> tag`);
  }
  if (/<body\b/i.test(html)) {
    errors.push(`❌ ${f} contains <body> tag`);
  }
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('✅ Legacy check passed');

#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const required = [
  'public/legacy/styles.css',
  'public/legacy/index.fragment.html',
  'public/legacy/login.fragment.html',
];
let errors = [];
for (const f of required) {
  const full = path.join(root, f);
  try {
    const stat = fs.statSync(full);
    if (stat.size === 0) {
      errors.push(`❌ ${f} is empty.`);
    }
  } catch {
    errors.push(`❌ Missing required file: ${f}`);
  }
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', '.next', 'dist'].includes(entry.name)) continue;
      walk(p);
    } else if (entry.isFile()) {
      if (p.endsWith(path.join('scripts', 'legacy-verify.mjs'))) continue;
      const s = fs.readFileSync(p, 'utf8');
      if (/login\.php/i.test(s)) {
        errors.push(`❌ Found legacy login.php reference in ${path.relative(root, p)}`);
      }
    }
  }
}
walk(root);

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('✅ Legacy verify passed');

#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const mustFiles = [
  'public/legacy/styles.css',
  'public/legacy/index.fragment.html',
  'public/legacy/login.fragment.html',
];

let errors = [];

function exists(p) {
  return fs.existsSync(path.join(root, p));
}

for (const f of mustFiles) {
  if (!exists(f)) errors.push(`❌ Missing required file: ${f}`);
}

function read(p) {
  return fs.readFileSync(path.join(root, p), 'utf8');
}

function checkFragment(fp) {
  if (!exists(fp)) return;
  const s = read(fp);

  // Hard safety checks
  if (/<script\b/i.test(s)) {
    errors.push(`❌ ${fp} contains <script> tags. Remove inline scripts from fragments.`);
  }
  if (/https?:\/\/quickgig\.ph\/login\.php/i.test(s) || /action=.*login\.php/i.test(s)) {
    errors.push(`❌ ${fp} points to legacy login.php. Forms must post to /api/session/login.`);
  }

  // Encourage root-relative asset paths
  const badRel = /(?:src|href)=["']\.\.?\//i;
  if (badRel.test(s)) {
    errors.push(`⚠️  ${fp} uses relative paths (../). Prefer root-relative paths like /legacy/img/...`);
  }
}
['public/legacy/index.fragment.html', 'public/legacy/login.fragment.html'].forEach(checkFragment);

// Repo-wide grep for login.php usage outside node_modules
function walk(dir, cb) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', '.next', 'dist', 'docs'].includes(entry.name)) continue;
      walk(p, cb);
    } else if (entry.isFile()) {
      cb(p);
    }
  }
}
const badRefs = [];
walk(root, (p) => {
  if (p.endsWith(path.join('scripts', 'legacy-verify.mjs'))) return;
  const s = fs.readFileSync(p, 'utf8');
  if (/login\.php|https?:\/\/quickgig\.ph\/login\.php/i.test(s)) {
    badRefs.push(p);
  }
});
if (badRefs.length) {
  errors.push(`❌ Found legacy "login.php" references in source:\n` +
              badRefs.map(p => `   - ${path.relative(root, p)}`).join('\n') +
              `\nRemove or route them to /api/session/login.`);
}

if (errors.length) {
  console.error('\nLegacy verify failed:\n' + errors.join('\n') + '\n');
  process.exit(1);
}
console.log('✅ Legacy verify passed: required files exist and no unsafe patterns found.');

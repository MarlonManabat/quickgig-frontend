// scripts/ci-verify.mjs
import { createRequire } from 'module';
import fs from 'node:fs';
import path from 'node:path';

const require = createRequire(import.meta.url);

function fail(msg) { console.error(`❌ ${msg}`); process.exit(1); }
function ok(msg) { console.log(`✅ ${msg}`); }

if (!process.version.startsWith('v20')) {
  fail(`Node version must be 20.x (got ${process.version})`);
}

const mustResolve = [
  'tailwindcss',
  'postcss',
  'autoprefixer',
  'globby',
  'zod'
];

for (const pkg of mustResolve) {
  try { require.resolve(pkg); }
  catch { fail(`Required dev dependency not installed: ${pkg}`); }
}

try { require.resolve('globbey'); fail('Found forbidden package "globbey"'); } catch {}

ok('Environment & dev deps look good');

// Warn if someone imports from public/**
const repoRoot = process.cwd();
let badImport = false;
function scan(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!p.includes('node_modules')) scan(p);
    } else if (/\.(ts|tsx|js|jsx)$/.test(entry.name)) {
      const text = fs.readFileSync(p, 'utf8');
      if (/from\s+['"]public\//.test(text)) { badImport = true; console.error(`Forbidden import in ${p}`); }
    }
  }
}
scan(path.join(repoRoot, 'src'));
if (badImport) fail('Forbidden imports from public/ detected');

ok('ci:verify passed');


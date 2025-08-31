// scripts/ci-verify.mjs
import { createRequire } from 'module';
import fs from 'node:fs';
import path from 'node:path';
const require = createRequire(import.meta.url);

function fail(msg){ console.error(`❌ ${msg}`); process.exit(1); }
function ok(msg){ console.log(`✅ ${msg}`); }

// engines
if (!process.version.startsWith('v20')) fail(`Node 20.x required (got ${process.version})`);

// must-have dev deps
for (const pkg of ['globby','zod','tailwindcss','postcss','autoprefixer']) {
  try { require.resolve(pkg); } catch { fail(`Missing dev dependency: ${pkg}`); }
}
// forbid typo package
try { require.resolve('globbey'); fail('Forbidden package "globbey" present'); } catch {}

// forbid imports from public/**
const root = process.cwd();
let bad = false;
const scan = (dir) => {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) { if (!p.includes('node_modules')) scan(p); continue; }
    if (!/\.(ts|tsx|js|jsx)$/.test(ent.name)) continue;
    const t = fs.readFileSync(p, 'utf8');
    if (/from\s+['"]public\//.test(t)) { bad = true; console.error(`Forbidden import from public/ → ${p}`); }
  }
};
if (fs.existsSync(path.join(root,'src'))) scan(path.join(root,'src'));
if (bad) fail('Forbidden imports from public/** detected');

ok('ci:verify passed');


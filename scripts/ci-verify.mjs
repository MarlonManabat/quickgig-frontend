// scripts/ci-verify.mjs
import { createRequire } from 'module';
import fs from 'node:fs';
import path from 'node:path';
const require = createRequire(import.meta.url);

function fail(msg) { console.error(`❌ ${msg}`); process.exit(1); }
function ok(msg) { console.log(`✅ ${msg}`); }

if (!process.version.startsWith('v20')) fail(`Node 20.x required (got ${process.version})`);

const mustResolve = ['tailwindcss','postcss','autoprefixer','globby','zod'];
for (const pkg of mustResolve) { try { require.resolve(pkg); } catch { fail(`Missing dev dependency: ${pkg}`); } }
try { require.resolve('globbey'); fail('Forbidden package "globbey" present'); } catch {}

const repoRoot = process.cwd();
let badImport = false;
function scan(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) { if (!p.includes('node_modules')) scan(p); }
    else if (/\.(ts|tsx|js|jsx)$/.test(ent.name)) {
      const t = fs.readFileSync(p, 'utf8');
      if (/from\s+['"]public\//.test(t)) { badImport = true; console.error(`Forbidden import from public/ in ${p}`); }
    }
  }
}
scan(path.join(repoRoot, 'src'));
if (badImport) fail('Forbidden imports from public/** detected');

ok('ci:verify passed');

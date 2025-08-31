#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { globby } from 'globby';

const fail = (msg) => { console.error(`❌ ${msg}`); process.exitCode = 1; };

const r = (p) => path.resolve(process.cwd(), p);

// 1) npm + lockfile
if (!fs.existsSync(r('package-lock.json'))) fail('package-lock.json missing (npm required)');

// 2) alias agreement
const ts = JSON.parse(fs.readFileSync(r('tsconfig.json'), 'utf8'));
const tsOK = ts?.compilerOptions?.paths?.['@/*']?.[0] === 'src/*';
if (!tsOK) fail('tsconfig.json must map "@/*" -> "src/*"');

const nextCfg = fs.readFileSync(r('next.config.js'), 'utf8');
if (!nextCfg.includes(`config.resolve.alias['@']`) || !nextCfg.includes(`'src'`)) {
  fail('next.config.js must alias "@" to src/');
}

// 3) duplicate route check
const pagesHealth = fs.existsSync(r('src/pages/api/health.ts'));
const appHealth = fs.existsSync(r('src/app/api/health/route.ts'));
if (pagesHealth && appHealth) fail('Duplicate health route: remove src/pages/api/health.ts (use app/api/health/route.ts)');

// 4) forbid TS imports from public/**
const tsFiles = await globby(['src/**/*.{ts,tsx}', 'scripts/**/*.{ts,tsx}']);
for (const f of tsFiles) {
  const s = fs.readFileSync(f, 'utf8');
  if (s.match(/from\s+['"]public\//)) { fail(`Import from public/ found in ${f}`); break; }
}

// 5) required files exist
['src/styles/globals.css','src/components/app/AppHeader.tsx','src/lib/env.ts','src/utils/supabaseClient.ts'].forEach(p => {
  if (!fs.existsSync(r(p))) fail(`Missing required file: ${p}`);
});

// 6) data existence if referenced
const dataRefs = await globby(['src/**/*.{ts,tsx}']);
const needs = new Set();
for (const f of dataRefs) {
  const s = fs.readFileSync(f, 'utf8');
  const m = s.match(/['"]@\/data\/([^'\"]+)['"]/g);
  m?.forEach(hit => needs.add(hit.slice(8, -1)));
}
for (const rel of needs) {
  if (!fs.existsSync(r(`src/data/${rel}`))) fail(`Missing data file src/data/${rel} (update imports or add file)`);
}

// 7) dep checks
const pkg = JSON.parse(fs.readFileSync(r('package.json'), 'utf8'));
const hasDep = (name) => (pkg.dependencies?.[name] || pkg.devDependencies?.[name]);
['tailwindcss','postcss','autoprefixer','zod','globby'].forEach(d => {
  if (!hasDep(d)) fail(`Dependency "${d}" not found in package.json`);
});

// 8) globby named import verification for our scripts
['scripts/check-dynamic-route-conflicts.mjs'].forEach(p => {
  if (fs.existsSync(r(p))) {
    const s = fs.readFileSync(r(p), 'utf8');
    if (!s.includes("import { globby } from 'globby'")) fail(`${p} must import globby as a named import`);
  }
});

// 9) required env vars present
['NEXT_PUBLIC_SUPABASE_URL','NEXT_PUBLIC_SUPABASE_ANON_KEY'].forEach(key => {
  if (!process.env[key]) fail(`Missing required env: ${key}`);
});

if (process.exitCode) process.exit(process.exitCode);
console.log('✅ Build contract preflight passed');

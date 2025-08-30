import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

let globby;
try {
  const mod = await import('globby');
  globby = mod.globby || mod.default || mod;
} catch (e) {
  console.warn('[route-check] globby not installed; skipping dynamic route conflict check.');
  process.exit(0);
}

const root = path.dirname(fileURLToPath(import.meta.url));
const proj = path.join(root, '..');

function keyOf(file) {
  // normalize path key by removing param name inside [...]
  return file
    .replace(proj + path.sep, '')
    .replace(/\[(.+?)\]/g, '[param]');
}

const files = await globby([
  'pages/**/*.tsx',
  'pages/**/*.ts',
  'app/**/*.tsx',
  'app/**/*.ts'
], { cwd: proj, absolute: true, gitignore: true });

const dyn = files.filter(f => /\[.+?\]\.(t|j)sx?$/.test(f));
const map = new Map();

for (const f of dyn) {
  const k = keyOf(f);
  if (!map.has(k)) map.set(k, []);
  map.get(k).push(f);
}

const conflicts = [...map.entries()].filter(([, arr]) => arr.length > 1);
if (conflicts.length) {
  console.error('Dynamic route param conflicts detected:\n');
  for (const [k, arr] of conflicts) {
    console.error(`Path key: ${k}`);
    arr.forEach(p => console.error('  - ' + path.relative(proj, p)));
  }
  process.exit(1);
}

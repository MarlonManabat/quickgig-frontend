// Supports globby v11 (default) and v14 (named)
let globbyFn;
try { ({ globby: globbyFn } = await import('globby')); }
catch { globbyFn = (await import('globby')).default; }

import path from 'node:path';
const patterns = ['src/app/**/page.tsx','src/pages/**/index.tsx']; // adjust if needed
const files = await globbyFn(patterns);
const names = files.map(f => path.basename(path.dirname(f)));
const dupes = names.filter((n,i) => names.indexOf(n) !== i);
if (dupes.length) {
  console.error('Route name conflicts:', dupes);
  process.exit(1);
}
console.log('No dynamic route conflicts');


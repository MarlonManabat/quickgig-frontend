import fs from 'node:fs';
const pages = ['src/app/page.tsx','src/app/login/page.tsx'].filter(p => fs.existsSync(p));
const bad = pages.filter(p => fs.readFileSync(p,'utf8').includes('io('));
if (bad.length) {
  console.error('Socket client imported on marketing pages:', bad.join(', '));
  process.exit(1);
}

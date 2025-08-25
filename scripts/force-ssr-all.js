// Force SSR for every page (except api/_app/_document/_error) by appending
// `export { forceSSR as getServerSideProps } from '@/lib/ssr'` when missing.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(process.cwd(), 'pages');
const SKIP_FILES = new Set(['_app.tsx', '_app.jsx', '_document.tsx', '_document.jsx', '_error.tsx', '_error.jsx']);

function walk(dir) {
  const out = [];
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) {
      if (name === 'api') continue;            // never touch API routes
      out.push(...walk(p));
    } else if (/\.(tsx|jsx)$/.test(name)) {
      if (SKIP_FILES.has(name)) continue;
      out.push(p);
    }
  }
  return out;
}

function hasGSSP(src) {
  return /export\s+(async\s+)?function\s+getServerSideProps\b/.test(src)
      || /export\s*{\s*getServerSideProps\s*as\s*\w+\s*}/.test(src)
      || /export\s*{\s*getServerSideProps\s*}/.test(src)
      || /export\s*{\s*forceSSR\s*as\s*getServerSideProps\s*}/.test(src);
}

const files = fs.existsSync(ROOT) ? walk(ROOT) : [];
let changed = 0;

for (const file of files) {
  let src = fs.readFileSync(file, 'utf8');
  if (hasGSSP(src)) continue;
  src += `\n\nexport { forceSSR as getServerSideProps } from '@/lib/ssr';\n`;
  fs.writeFileSync(file, src);
  changed++;
  console.log('SSR-forced:', path.relative(process.cwd(), file));
}

console.log(`Done. Modified ${changed} page(s).`);

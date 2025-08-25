// CI-only codemod: make every non-API page SSR-only during build.
// - Skips pages that already have getServerSideProps
// - Strips getStaticProps / getStaticPaths exports before adding SSR
// - Never touches _app/_document/_error or /api/**

const fs = require('fs');
const path = require('path');

const ROOT = path.join(process.cwd(), 'pages');
const SKIP_FILES = new Set(['_app.tsx','_app.jsx','_document.tsx','_document.jsx','_error.tsx','_error.jsx']);

function walk(dir) {
  const out = [];
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) {
      if (name === 'api') continue;
      out.push(...walk(p));
    } else if (/\.(tsx|jsx)$/.test(name)) {
      if (SKIP_FILES.has(name)) continue;
      out.push(p);
    }
  }
  return out;
}

function hasGSSP(src) {
  return (
    /export\s+(?:async\s+)?function\s+getServerSideProps\b/.test(src) ||
    /export\s+(?:const|let|var)\s+getServerSideProps\s*[:=]/.test(src) ||
    /export\s*{\s*getServerSideProps\b/.test(src) ||
    /export\s*{\s*forceSSR\s*as\s*getServerSideProps\s*}/.test(src)
  );
}

// Remove SSG exports so Next won't try to prerender in CI
function stripSSG(src) {
  // function form
  src = src.replace(
    /export\s+async\s+function\s+getStaticProps\s*\(/g,
    '/* ci-ssr */ async function __ciRemoved_getStaticProps('
  );
  src = src.replace(
    /export\s+async\s+function\s+getStaticPaths\s*\(/g,
    '/* ci-ssr */ async function __ciRemoved_getStaticPaths('
  );

  // const form
  src = src.replace(
    /export\s+(const|let|var)\s+getStaticProps\s*[:=]/g,
    '/* ci-ssr */ $1 __ciRemoved_getStaticProps ='
  );
  src = src.replace(
    /export\s+(const|let|var)\s+getStaticPaths\s*[:=]/g,
    '/* ci-ssr */ $1 __ciRemoved_getStaticPaths ='
  );

  // named export lists: export { getStaticProps, ... }
  src = src.replace(/export\s*{\s*([^}]*)\}/g, (m, names) => {
    const kept = names
      .split(',')
      .map(s => s.trim())
      .filter(n => !/^getStaticProps\b/.test(n) && !/^getStaticPaths\b/.test(n))
      .join(', ');
    if (!kept) return '/* ci-ssr */';
    return `export { ${kept} }`;
  });

  return src;
}

function run() {
  if (!fs.existsSync(ROOT)) return console.log('No pages/ directory, skipping');
  const files = walk(ROOT);
  let changed = 0;

  for (const file of files) {
    let src = fs.readFileSync(file, 'utf8');

    // If the page already has GSSP, leave it alone
    if (hasGSSP(src)) continue;

    // Strip SSG if present
    const before = src;
    src = stripSSG(src);

    // Add SSR export
    src += `\n\nexport { forceSSR as getServerSideProps } from '@/lib/ssr';\n`;

    if (src !== before) {
      fs.writeFileSync(file, src);
      changed++;
      console.log('SSR-forced:', path.relative(process.cwd(), file));
    }
  }

  console.log(`Done. Modified ${changed} page(s).`);
}

run();

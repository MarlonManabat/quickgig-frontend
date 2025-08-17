import fs from 'fs';
import path from 'path';

const pretty = process.argv.includes('--pretty');
const root = process.cwd();
const legacyDir = path.join(root, 'public', 'legacy');

const required = [
  'styles.css',
  'index.fragment.html',
  'login.fragment.html',
];
const optional = [
  path.join('img', 'logo-main.png'),
  path.join('img', 'logo-horizontal.png'),
  path.join('img', 'logo-icon.png'),
];

function exists(rel) {
  return fs.existsSync(path.join(legacyDir, rel));
}

const missing = [];
for (const f of required) {
  if (!exists(f)) missing.push(f);
}

const warnings = [];
for (const f of optional) {
  if (!exists(f)) warnings.push(f);
}
const fontsDir = path.join(legacyDir, 'fonts');
if (
  !fs.existsSync(fontsDir) ||
  fs.readdirSync(fontsDir).filter((f) => !f.startsWith('.')).length === 0
) {
  warnings.push('fonts/*');
}

if (pretty) {
  for (const frag of ['index.fragment.html', 'login.fragment.html']) {
    const p = path.join(legacyDir, frag);
    if (fs.existsSync(p)) {
      const preview = fs.readFileSync(p, 'utf8').slice(0, 200).replace(/\s+/g, ' ').trim();
      console.log(`\n${frag}: ${preview}`);
    }
  }
  const rows = [
    ...required.map((f) => ({ file: `public/legacy/${f}`, status: missing.includes(f) ? 'missing' : 'ok' })),
    ...optional.map((f) => ({ file: `public/legacy/${f}`, status: warnings.includes(f) ? 'warn' : 'ok' })),
    { file: 'public/legacy/fonts/*', status: warnings.includes('fonts/*') ? 'warn' : 'ok' },
  ];
  console.log();
  console.table(rows);
  process.exit(0);
}

if (warnings.length) {
  for (const w of warnings) {
    console.warn(`Warning: public/legacy/${w} missing`);
  }
}

if (missing.length) {
  for (const m of missing) {
    console.error(`Missing required file: public/legacy/${m}`);
  }
  console.error('\nLegacy assets: FAIL');
  process.exit(1);
}

console.log('Legacy assets: PASS');
process.exit(0);

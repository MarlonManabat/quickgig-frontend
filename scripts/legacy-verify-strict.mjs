import fs from 'fs';
import path from 'path';

const root = process.cwd();
const must = [
  'public/legacy/index.fragment.html',
  'public/legacy/login.fragment.html',
  'public/legacy/styles.css',
];

const badText = [
  /lorem ipsum/i,
  /\bplaceholder\b/i,
  /\blipsum\b/i,
  /\bTODO\b/i,
];

const disallow = [
  /<script\b/i,
  /\bon[a-z]+\s*=/i,
  /javascript\s*:/i,
];

function read(file) {
  try { return fs.readFileSync(path.join(root, file), 'utf8'); }
  catch { return null; }
}

let errs = [];

// required files
for (const f of must) {
  if (!fs.existsSync(path.join(root, f))) errs.push(`Missing required file: ${f}`);
}

// scan html/css for placeholders and disallowed patterns
const scanFiles = (dir) => {
  if (!fs.existsSync(path.join(root, dir))) return;
  const walk = (p) => {
    for (const name of fs.readdirSync(p)) {
      const full = path.join(p, name);
      const rel = path.relative(root, full);
      const st = fs.statSync(full);
      if (st.isDirectory()) walk(full);
      else if (/\.(html|css)$/i.test(name)) {
        const txt = fs.readFileSync(full, 'utf8');
        for (const rx of badText) if (rx.test(txt)) errs.push(`Placeholder text found in ${rel} (${rx})`);
        for (const rx of disallow) if (rx.test(txt)) errs.push(`Disallowed pattern in ${rel} (${rx})`);
      }
    }
  };
  walk(path.join(root, dir));
};
scanFiles('public/legacy');

if (errs.length) {
  console.error('legacy:verify:strict failed:\n- ' + errs.join('\n- '));
  process.exit(1);
} else {
  console.log('legacy:verify:strict OK');
}

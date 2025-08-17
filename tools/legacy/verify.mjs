import fs from 'fs';
import path from 'path';
import cheerio from 'cheerio';

const args = process.argv.slice(2);
const mode = args.includes('--check') ? 'check' : 'verify';

const root = process.cwd();
const legacyDir = path.join(root, 'public', 'legacy');

const required = ['styles.css', 'index.fragment.html', 'login.fragment.html'];
const errors = [];
const warnings = [];

function checkRequired(rel) {
  const fp = path.join(legacyDir, rel);
  if (!fs.existsSync(fp)) {
    errors.push(`Missing required file: public/legacy/${rel}`);
    return false;
  }
  const size = fs.statSync(fp).size;
  if (size <= 1024) {
    errors.push(`File too small (<1KB): public/legacy/${rel}`);
  }
  return true;
}

for (const f of required) checkRequired(f);

let usesImg = false;
let usesFonts = false;
for (const frag of ['index.fragment.html', 'login.fragment.html']) {
  const fp = path.join(legacyDir, frag);
  if (!fs.existsSync(fp)) continue;
  const html = fs.readFileSync(fp, 'utf8');
  if (/<script[\s>]/i.test(html)) {
    errors.push(`Forbidden <script> tag in public/legacy/${frag}`);
  }
  if (/on\w+=/i.test(html)) {
    errors.push(`Inline event handler in public/legacy/${frag}`);
  }
  const $ = cheerio.load(html);
  $('[src],[href]').each((_, el) => {
    for (const attr of ['src', 'href']) {
      const val = $(el).attr(attr);
      if (!val) continue;
      if (/^https?:\/\//i.test(val)) continue;
      if (val.startsWith('/legacy/img/')) {
        usesImg = true;
      } else if (val.startsWith('/legacy/fonts/')) {
        usesFonts = true;
      } else if (val.startsWith('/img/') || val.startsWith('/assets/img/') || val.startsWith('/fonts/')) {
        errors.push(`Non-legacy asset ${val} in public/legacy/${frag}`);
      }
    }
  });
}

if (usesImg) {
  const dir = path.join(legacyDir, 'img');
  if (!fs.existsSync(dir) || fs.readdirSync(dir).filter((f) => !f.startsWith('.')).length === 0) {
    warnings.push('public/legacy/img missing');
  }
}
if (usesFonts) {
  const dir = path.join(legacyDir, 'fonts');
  if (!fs.existsSync(dir) || fs.readdirSync(dir).filter((f) => !f.startsWith('.')).length === 0) {
    warnings.push('public/legacy/fonts missing');
  }
}

if (mode === 'check') {
  const rows = required.map((f) => ({ file: `public/legacy/${f}`, status: errors.find((e) => e.includes(f)) ? 'fail' : 'ok' }));
  console.table(rows);
  if (warnings.length) {
    for (const w of warnings) console.warn(`Warning: ${w}`);
  }
  if (errors.length) {
    for (const e of errors) console.error(e);
  }
  process.exit(0);
}

if (warnings.length) {
  for (const w of warnings) console.warn(`Warning: ${w}`);
}
if (errors.length) {
  for (const e of errors) console.error(e);
  console.error('\nLegacy assets: FAIL');
  process.exit(1);
}
console.log('Legacy assets: PASS');
process.exit(0);

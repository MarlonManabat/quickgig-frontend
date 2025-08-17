import fs from 'fs';
import path from 'path';
import cheerio from 'cheerio';

const args = process.argv.slice(2);
const pretty = args.includes('--pretty');

const root = process.cwd();
const legacyDir = path.join(root, 'public', 'legacy');

const required = ['styles.css', 'index.fragment.html', 'login.fragment.html'];
const missing = [];
const warnings = [];

function checkRequired(rel) {
  const fp = path.join(legacyDir, rel);
  if (!fs.existsSync(fp)) {
    missing.push(`Missing required file: public/legacy/${rel}`);
    return false;
  }
  const size = fs.statSync(fp).size;
  if (size <= 1024) {
    warnings.push(`File too small (<1KB): public/legacy/${rel}`);
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
    warnings.push(`Forbidden <script> tag in public/legacy/${frag}`);
  }
  if (/on\w+=/i.test(html)) {
    warnings.push(`Inline event handler in public/legacy/${frag}`);
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
        warnings.push(`Non-legacy asset ${val} in public/legacy/${frag}`);
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

if (pretty) {
  const rows = required.map((f) => ({ file: `public/legacy/${f}`, status: missing.find((m) => m.includes(f)) ? 'missing' : 'ok' }));
  console.table(rows);
  if (warnings.length) {
    for (const w of warnings) console.warn(`Warning: ${w}`);
  }
  if (missing.length) {
    for (const m of missing) console.error(m);
  }
  process.exit(0);
}

if (warnings.length) {
  for (const w of warnings) console.warn(`Warning: ${w}`);
}
if (missing.length) {
  for (const m of missing) console.error(m);
  process.exit(1);
}
console.log('Legacy assets: OK');
process.exit(0);

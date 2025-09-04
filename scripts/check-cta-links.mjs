import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const banned = [/\/post-job\b/, /\/find\b/, /\/my-applications\b/, /\/applications\/login\b/];
const roots = ['src', 'tests'];

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) yield* walk(p);
    else if (s.isFile()) yield p;
  }
}

const hrefBanned = banned.map(re => new RegExp(`href=["']${re.source}`));
let bad = [];
for (const root of roots) {
  try {
    for (const file of walk(root)) {
      const txt = readFileSync(file, 'utf8');
      if (hrefBanned.some(re => re.test(txt))) bad.push(file);
    }
  } catch {}
}

if (bad.length) {
  console.error('Banned CTA links found in:\n' + bad.map(b => ' - ' + b).join('\n'));
  process.exit(1);
} else {
  console.log('✔ No banned CTA links found.');
}

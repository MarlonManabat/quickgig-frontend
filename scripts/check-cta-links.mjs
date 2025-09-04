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

const errors = [];
try {
  const header = readFileSync('src/components/AppHeader.tsx', 'utf8');
  const tokens = [
    'nav-',
    'navm-',
    'browse-jobs',
    'post-job',
    'my-applications',
    'login',
  ];
  const routes = [
    'ROUTES.browseJobs',
    'ROUTES.postJob',
    'ROUTES.applications',
    'ROUTES.login',
  ];
  for (const t of tokens) if (!header.includes(t)) errors.push(`missing ${t} in AppHeader.tsx`);
  for (const route of routes) if (!header.includes(route)) errors.push(`missing ${route} in AppHeader.tsx`);
} catch (e) {
  errors.push('could not read AppHeader.tsx');
}

try {
  const hero = readFileSync('src/components/landing/Hero.tsx', 'utf8');
  const ids = ['hero-browse-jobs', 'hero-post-job'];
  const routes = ['ROUTES.browseJobs', 'ROUTES.postJob'];
  for (const id of ids) if (!hero.includes(id)) errors.push(`missing ${id} in Hero.tsx`);
  for (const route of routes) if (!hero.includes(route)) errors.push(`missing ${route} in Hero.tsx`);
} catch (e) {
  errors.push('could not read Hero.tsx');
}

if (bad.length || errors.length) {
  if (bad.length) console.error('Banned CTA links found in:\n' + bad.map(b => ' - ' + b).join('\n'));
  if (errors.length) console.error('CTA link check failed:\n' + errors.map(e => ' - ' + e).join('\n'));
  process.exit(1);
} else {
  console.log('✔ CTA links map to canonical routes.');
}

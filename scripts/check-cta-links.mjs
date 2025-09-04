import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const CTA_MAP = {
  'nav-browse-jobs': 'ROUTES.browseJobs',
  'nav-post-job': 'ROUTES.gigsCreate',
  'nav-my-applications': 'ROUTES.applications',
  'nav-login': 'ROUTES.login',
  'navm-browse-jobs': 'ROUTES.browseJobs',
  'navm-post-job': 'ROUTES.gigsCreate',
  'navm-my-applications': 'ROUTES.applications',
  'navm-login': 'ROUTES.login',
  'hero-browse-jobs': 'ROUTES.browseJobs',
  'hero-post-job': 'ROUTES.gigsCreate'
};

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) yield* walk(p);
    else if (s.isFile()) yield p;
  }
}

let errors = [];
for (const file of walk('src')) {
  const txt = readFileSync(file, 'utf8');
  for (const [id, route] of Object.entries(CTA_MAP)) {
    const marker = `data-testid="${id}"`;
    const idx = txt.indexOf(marker);
    if (idx !== -1) {
      const snippet = txt.slice(Math.max(0, idx - 100), idx + 200);
      if (!snippet.includes(route)) {
        errors.push(`${file} → ${id}`);
      }
    }
  }
}

if (errors.length) {
  console.error('CTA link mismatches:\n' + errors.map(e => ' - ' + e).join('\n'));
  process.exit(1);
} else {
  console.log('✔ CTA links use canonical routes');
}

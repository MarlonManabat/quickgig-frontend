import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const HEADER_IDS = {
  'nav-browse-jobs': 'ROUTES.browseJobs',
  'nav-post-job': 'ROUTES.postJob',
  'nav-my-applications': 'ROUTES.applications',
  'nav-login': 'ROUTES.login',
  'navm-browse-jobs': 'ROUTES.browseJobs',
  'navm-post-job': 'ROUTES.postJob',
  'navm-my-applications': 'ROUTES.applications',
  'navm-login': 'ROUTES.login',
};

const HERO_IDS = {
  'hero-browse-jobs': 'ROUTES.browseJobs',
  'hero-post-job': 'ROUTES.postJob',
};

let errors = [];

// Validate header mappings in src/lib/routes.ts
const routesTxt = readFileSync('src/lib/routes.ts', 'utf8');
for (const [id, routeConst] of Object.entries(HEADER_IDS)) {
  const key = id.startsWith('navm-') ? 'idMobile' : 'idDesktop';
  const marker = `${key}: '${id}'`;
  const idx = routesTxt.indexOf(marker);
  if (idx === -1) {
    errors.push(`routes.ts → ${id}`);
    continue;
  }
  const snippet = routesTxt.slice(Math.max(0, idx - 200), idx + 200);
  if (!snippet.includes(`to: ${routeConst}`)) {
    errors.push(`routes.ts → ${id}`);
  }
}

// Validate hero CTAs in source files
function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) yield* walk(p);
    else if (s.isFile()) yield p;
  }
}

for (const file of walk('src')) {
  const txt = readFileSync(file, 'utf8');
  for (const [id, route] of Object.entries(HERO_IDS)) {
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

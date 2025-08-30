import { globby } from 'globby';
import path from 'node:path';
import fs from 'node:fs/promises';

const pages = await globby(['src/app/**/page.tsx', 'src/pages/**/*.tsx'], {
  gitignore: true,
});

const routes = new Map();
for (const file of pages) {
  const route = path
    .dirname(file)
    .replace(/^src\/app/, '')
    .replace(/^src\/pages/, '')
    .replace(/\/page$/, '')
    || '/';

  if (routes.has(route)) {
    const first = routes.get(route);
    console.error(`Route conflict: "${route}" defined by:\n - ${first}\n - ${file}`);
    process.exit(1);
  }
  routes.set(route, file);
}

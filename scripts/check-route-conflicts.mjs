import { readdir, stat } from 'fs/promises';
import path from 'path';

async function getAppSlugs() {
  const dir = path.join('src', 'app');
  const entries = await readdir(dir, { withFileTypes: true });
  const out = new Map();
  for (const e of entries) {
    if (!e.isDirectory()) continue;
    for (const ext of ['tsx', 'jsx']) {
      const p = path.join(dir, e.name, `page.${ext}`);
      try {
        await stat(p);
        out.set(e.name, p);
        break;
      } catch {}
    }
  }
  return out;
}

async function getPagesSlugs() {
  const dir = path.join('src', 'pages');
  const entries = await readdir(dir, { withFileTypes: true });
  const out = new Map();
  for (const e of entries) {
    if (!e.isFile()) continue;
    if (!e.name.match(/\.(tsx|jsx)$/)) continue;
    const slug = e.name.replace(/\.(tsx|jsx)$/,'');
    out.set(slug, path.join(dir, e.name));
  }
  return out;
}

async function main() {
  const app = await getAppSlugs();
  const pages = await getPagesSlugs();
  const conflicts = [];
  for (const [slug, appPath] of app) {
    const pagePath = pages.get(slug);
    if (pagePath) conflicts.push({ slug, appPath, pagePath });
  }
  if (conflicts.length) {
    console.log('Duplicate routes detected:');
    for (const c of conflicts) {
      console.log(`${c.slug}:`);
      console.log(`  App: ${c.appPath}`);
      console.log(`  Pages: ${c.pagePath}`);
    }
    process.exit(1);
  }
  console.log('No route conflicts');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

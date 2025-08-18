/* eslint-disable no-console */
import fs from 'fs';
import path from 'path';

interface LinkInfo {
  href: string;
  source: string;
}

function collectRoutes(): string[] {
  const routes = new Set<string>();
  const root = process.cwd();

  function walkPages(dir: string, prefix = '') {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      const rel = path.join(prefix, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === 'api') continue;
        walkPages(full, rel);
      } else if (entry.isFile() && /\.(tsx|ts|js|jsx|mdx)$/.test(entry.name) && !entry.name.startsWith('_')) {
        const name = entry.name.replace(/\.(tsx|ts|js|jsx|mdx)$/i, '');
        const routePath = name === 'index' ? prefix : path.join(prefix, name);
        routes.add('/' + routePath.replace(/\\/g, '/'));
      }
    }
  }

  function walkApp(dir: string, prefix = '') {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      const rel = path.join(prefix, entry.name);
      if (entry.isDirectory()) {
        walkApp(full, rel);
      } else if (entry.isFile() && /^page\.(tsx|ts|js|jsx)$/.test(entry.name)) {
        routes.add('/' + prefix.replace(/\\/g, '/'));
      }
    }
  }

  walkPages(path.join(root, 'src/pages'));
  walkApp(path.join(root, 'src/app'));
  return Array.from(routes);
}

function routeToRegex(route: string): RegExp {
  const pattern = route
    .replace(/\[\.\.\.([^/]+)\]/g, '.*')
    .replace(/\[([^/]+)\]/g, '[^/]+');
  return new RegExp('^' + pattern + '$');
}

function collectLinks(): LinkInfo[] {
  const files = [
    path.join(process.cwd(), 'src/components/Navigation.tsx'),
    path.join(process.cwd(), 'src/app/layout.tsx'),
    path.join(process.cwd(), 'src/components/layouts/AppShellV2.tsx'),
  ];
  const links: LinkInfo[] = [];
  const hrefRegex = /href=["']([^"'{]+)["']/g;
  for (const file of files) {
    if (!fs.existsSync(file)) continue;
    const content = fs.readFileSync(file, 'utf8');
    let match: RegExpExecArray | null;
    while ((match = hrefRegex.exec(content))) {
      const href = match[1];
      if (href.startsWith('http') || href.startsWith('#') || href.includes('{')) continue;
      links.push({ href, source: path.relative(process.cwd(), file) });
    }
  }
  // scan for data-testid links
  const srcDir = path.join(process.cwd(), 'src');
  function walk(dir: string) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.isFile() && entry.name.endsWith('.tsx')) {
        const content = fs.readFileSync(full, 'utf8');
        const re = /<[^>]*data-testid=["'][^"']+["'][^>]*href=["']([^"'{]+)["'][^>]*>/g;
        let m: RegExpExecArray | null;
        while ((m = re.exec(content))) {
          const href = m[1];
          if (href.startsWith('http') || href.startsWith('#')) continue;
          links.push({ href, source: path.relative(process.cwd(), full) });
        }
      }
    }
  }
  walk(srcDir);
  return links;
}

export function linkMapSanity() {
  const routes = collectRoutes();
  const regs = routes.map(routeToRegex);
  const links = collectLinks();
  const misses: LinkInfo[] = [];
  for (const link of links) {
    const clean = link.href.replace(/\/+$/, '') || '/';
    if (!regs.some((r) => r.test(clean))) {
      misses.push(link);
    }
  }
  if (misses.length) {
    for (const m of misses) {
      console.warn(`[linkMapSanity] missing route ${m.href} (from ${m.source})`);
    }
  } else {
    console.log('[linkMapSanity] all links valid');
  }
}

export default linkMapSanity;

if (import.meta.url === `file://${process.argv[1]}`) {
  linkMapSanity();
}

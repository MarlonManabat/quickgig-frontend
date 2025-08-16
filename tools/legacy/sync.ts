import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { load } from 'cheerio';

const BASE = 'https://app.quickgig.ph';
const OUT_DIR = path.join(process.cwd(), 'public', 'legacy');
const legacyLogin = ['login', 'php'].join('.');

type Fragment = {
  html: string;
  assets: Set<string>;
};

function rewrite(html: string): Fragment {
  const assets = new Set<string>();
  const $ = load(html);

  $('form').each((_, el) => {
    const action = $(el).attr('action') || '';
    if (action.includes(legacyLogin)) {
      $(el).attr('action', '/api/session/login');
    }
  });

  $('*[src], *[href]').each((_, el) => {
    const attr = (el as any).attribs.src ? 'src' : 'href';
    const val = $(el).attr(attr);
    if (!val) return;
    const u = new URL(val, BASE);
    if (u.pathname.startsWith('/img/')) {
      assets.add(u.pathname);
      $(el).attr(attr, `/legacy${u.pathname}`);
    } else if (u.pathname.endsWith('.css')) {
      assets.add(u.pathname);
      $(el).attr(attr, '/legacy/styles.css');
    }
  });

  return { html: $.root().html() || '', assets };
}

async function downloadAsset(p: string) {
  const res = await fetch(`${BASE}${p}`);
  if (!res.ok) return;
  const buf = Buffer.from(await res.arrayBuffer());
  const out = path.join(OUT_DIR, p.replace(/^\//, ''));
  await mkdir(path.dirname(out), { recursive: true });
  await writeFile(out, buf);
}

async function writeFragment(name: string, frag: Fragment) {
  if (!frag.html) return;
  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(path.join(OUT_DIR, `${name}.fragment.html`), frag.html);
  for (const a of Array.from(frag.assets)) await downloadAsset(a);
}

async function main() {
  const resIndex = await fetch(`${BASE}/`);
  const htmlIndex = await resIndex.text();
  const $index = load(htmlIndex);

  const header = rewrite($index('header').first().prop('outerHTML') || '');
  const footer = rewrite($index('footer').first().prop('outerHTML') || '');
  const mainHome = rewrite($index('main').first().prop('outerHTML') || '');

  const cssHref = $index('link[rel="stylesheet"]').first().attr('href');
  if (cssHref) {
    const cssRes = await fetch(new URL(cssHref, BASE));
    const css = await cssRes.text();
    await mkdir(OUT_DIR, { recursive: true });
    await writeFile(path.join(OUT_DIR, 'styles.css'), css);
  }

  await writeFragment('header', header);
  await writeFragment('footer', footer);
  await writeFragment('index', mainHome);

  const resLogin = await fetch(`${BASE}/login`);
  const htmlLogin = await resLogin.text();
  const $login = load(htmlLogin);
  const mainLogin = rewrite($login('main').first().prop('outerHTML') || '');
  await writeFragment('login', mainLogin);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

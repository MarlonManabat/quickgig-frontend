import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { load } from 'cheerio';

const arg = process.argv.find((a) => a.startsWith('--source='));
const BASE = arg ? arg.split('=')[1] : 'https://app.quickgig.ph';
const OUT_DIR = path.join(process.cwd(), 'public', 'legacy');
const legacyLogin = ['login', 'php'].join('.');

function rewrite(html) {
  const assets = new Set();
  const $ = load(html);

  $('form').each((_, el) => {
    const action = el.attribs.action || '';
    if (action.includes(legacyLogin)) {
      el.attribs.action = '/api/session/login';
    }
  });

  $('*[src], *[href]').each((_, el) => {
    const attr = el.attribs.src ? 'src' : 'href';
    const val = el.attribs[attr];
    if (!val) return;
    const u = new URL(val, BASE);
    if (u.pathname.startsWith('/img/') || u.pathname.startsWith('/fonts/')) {
      assets.add(u.pathname);
      el.attribs[attr] = `/legacy${u.pathname}`;
    } else if (u.pathname.endsWith('.css')) {
      assets.add(u.pathname);
      el.attribs[attr] = '/legacy/styles.css';
    }
  });

  return { html: $.root().html() || '', assets };
}

async function downloadAsset(p) {
  const res = await fetch(`${BASE}${p}`);
  if (!res.ok) return;
  const buf = Buffer.from(await res.arrayBuffer());
  const out = path.join(OUT_DIR, p.replace(/^\//, ''));
  await mkdir(path.dirname(out), { recursive: true });
  await writeFile(out, buf);
}

async function writeFragment(name, frag) {
  if (!frag.html) return;
  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(path.join(OUT_DIR, `${name}.fragment.html`), frag.html);
  for (const a of frag.assets) await downloadAsset(a);
}

async function processCss(href) {
  const cssRes = await fetch(new URL(href, BASE));
  let css = await cssRes.text();
  const assets = new Set();
  css = css.replace(/url\(([^)]+)\)/g, (m, p1) => {
    const cleaned = p1.replace(/["']/g, '').trim();
    const u = new URL(cleaned, BASE);
    if (u.pathname.startsWith('/img/') || u.pathname.startsWith('/fonts/')) {
      assets.add(u.pathname);
      return `url(/legacy${u.pathname})`;
    }
    return `url(${cleaned})`;
  });
  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(path.join(OUT_DIR, 'styles.css'), css);
  for (const a of assets) await downloadAsset(a);
}

async function main() {
  await mkdir(path.join(OUT_DIR, 'img'), { recursive: true });
  await mkdir(path.join(OUT_DIR, 'fonts'), { recursive: true });

  const resIndex = await fetch(`${BASE}/`);
  const htmlIndex = await resIndex.text();
  const $index = load(htmlIndex);

  const header = rewrite($index('header').first().prop('outerHTML') || '');
  const footer = rewrite($index('footer').first().prop('outerHTML') || '');
  const mainHome = rewrite($index('main').first().prop('outerHTML') || '');

  const cssHref = $index('link[rel="stylesheet"]').first().attr('href');
  if (cssHref) await processCss(cssHref);

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

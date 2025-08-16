import { promises as fs } from 'fs';
import path from 'path';
import { load, Element } from 'cheerio';

const required = [
  'styles.css',
  'index.fragment.html',
  'login.fragment.html',
];

const optional = ['header.fragment.html', 'footer.fragment.html'];
const legacyLogin = ['login', 'php'].join('.');

async function exists(p: string) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const dir = path.join(process.cwd(), 'public', 'legacy');
  let ok = true;

  for (const f of required) {
    const file = path.join(dir, f);
    if (!(await exists(file))) {
      console.error(`[legacy:verify] Missing: ${f}`);
      ok = false;
    }
  }

  for (const f of optional) {
    const file = path.join(dir, f);
    if (!(await exists(file))) {
      console.warn(`[legacy:verify] Optional fragment missing: ${f}`);
    }
  }

  const files = await fs.readdir(dir);
  for (const f of files) {
    if (!f.endsWith('.html')) continue;
    const filePath = path.join(dir, f);
    const content = await fs.readFile(filePath, 'utf8');
    if (content.includes(legacyLogin) || content.includes(`quickgig.ph/${legacyLogin}`)) {
      console.error(`[legacy:verify] Found legacy login reference in ${f}`);
      ok = false;
    }

    const $ = load(content);
    $('*[src], *[href]').each((_, el) => {
      const element = el as Element;
      const tag = element.tagName?.toLowerCase();
      if (tag === 'a') return;
      const attr = element.attribs.src ? 'src' : 'href';
      const val = element.attribs[attr];
      if (!val) return;
      if (val.startsWith('http') || val.startsWith('data:')) return;
      if (!val.startsWith('/legacy/')) {
        console.error(`[legacy:verify] Non-legacy asset ${val} in ${f}`);
        ok = false;
      }
    });
  }

  try {
    const imgs = await fs.readdir(path.join(dir, 'img'));
    if (imgs.length === 0) {
      console.error('[legacy:verify] No images found in public/legacy/img');
      ok = false;
    }
  } catch {
    console.error('[legacy:verify] Missing public/legacy/img directory');
    ok = false;
  }

  if (!ok) process.exit(1);
  console.log('[legacy:verify] OK');
}

main();

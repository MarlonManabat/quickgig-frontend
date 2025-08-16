import { promises as fs } from 'fs';
import path from 'path';

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
    const content = await fs.readFile(path.join(dir, f), 'utf8');
    if (content.includes(legacyLogin) || content.includes(`quickgig.ph/${legacyLogin}`)) {
      console.error(`[legacy:verify] Found legacy login reference in ${f}`);
      ok = false;
    }
  }

  if (!ok) process.exit(1);
  console.log('[legacy:verify] OK');
}

main();

import { promises as fs } from 'fs';
import path from 'path';

const legacyDir = path.join(process.cwd(), 'public', 'legacy');
const requiredFiles = [
  'styles.css',
  'index.fragment.html',
  'login.fragment.html',
];

async function checkExists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  let ok = true;

  for (const rel of requiredFiles) {
    const file = path.join(legacyDir, rel);
    if (!(await checkExists(file))) {
      console.error(`[legacy:verify] Missing required file: public/legacy/${rel}`);
      ok = false;
    }
  }

  const favicon = path.join(process.cwd(), 'public', 'favicon.png');
  if (!(await checkExists(favicon))) {
    console.warn('[legacy:verify] Warning: public/favicon.png missing');
  }

  for (const frag of ['index.fragment.html', 'login.fragment.html']) {
    const file = path.join(legacyDir, frag);
    try {
      const content = await fs.readFile(file, 'utf8');
      const preview = content.slice(0, 200).replace(/\s+/g, ' ').trim();
      console.log(`[legacy:verify] ${frag}: ${preview}`);
    } catch (err) {
      /* already handled missing */
    }
  }

  if (!ok) {
    process.exit(1);
  }
  console.log("[legacy:verify] OK");
}

main();

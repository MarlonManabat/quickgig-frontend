import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOTS = ['app', 'components'];
const BANNED = ['/find', '/post ', '/posts', '/gigs/new'];

function walk(dir) {
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const full = join(dir, entry);
    const stats = statSync(full);
    if (stats.isDirectory()) {
      walk(full);
    } else if (stats.isFile()) {
      const content = readFileSync(full, 'utf8');
      for (const pattern of BANNED) {
        if (content.includes(pattern)) {
          console.error(`Found banned pattern "${pattern}" in ${full}`);
          process.exitCode = 1;
        }
      }
    }
  }
}

for (const root of ROOTS) {
  try {
    walk(root);
  } catch (error) {
    if (error.code === 'ENOENT') continue;
    throw error;
  }
}

if (process.exitCode === 1) {
  process.exit(1);
} else {
  console.log('CTA link audit passed.');
}

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const FORBIDDEN = ['data-testid="cta-post-job"', 'data-testid="cta-my-applications"'];
const ROOTS = ['src', 'tests'];

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) yield* walk(p);
    else if (s.isFile()) yield p;
  }
}

let bad = [];
for (const root of ROOTS) {
  try {
    for (const file of walk(root)) {
      const txt = readFileSync(file, 'utf8');
      if (FORBIDDEN.some(f => txt.includes(f))) bad.push(file);
    }
  } catch {}
}

if (bad.length) {
  console.error('Forbidden legacy testIds found in:\n' + bad.map(b => ' - ' + b).join('\n'));
  process.exit(1);
} else {
  console.log('✔ No legacy CTA testIds found.');
}

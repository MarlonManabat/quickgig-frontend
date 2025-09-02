#!/usr/bin/env node
import { globby } from 'globby';
import fs from 'node:fs';

async function main() {
  const files = await globby(['src/app/**/page.{ts,tsx}', 'app/**/page.{ts,tsx}']);
  const offenders: string[] = [];

  for (const f of files) {
    const src = fs.readFileSync(f, 'utf8');
    const isClient = /^\s*['"]use client['"]/.test(src);
    const hasRevalidate = /\bexport\s+const\s+revalidate\b/.test(src);
    if (isClient && hasRevalidate) offenders.push(f);
  }

  if (offenders.length) {
    console.error('\n❌ Client pages must NOT export `revalidate`:\n' + offenders.map(x => ' - ' + x).join('\n'));
    process.exit(1);
  }
  console.log('✅ revalidate exports look good.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

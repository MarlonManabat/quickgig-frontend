#!/usr/bin/env node
/* eslint-disable no-console */
// Fails if UI code still hardcodes https://app.quickgig.ph (docs ignored)
import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
const patterns = [
  ['app', 'app/**/*.{js,jsx,ts,tsx,mdx}'],
  ['pages', 'pages/**/*.{js,jsx,ts,tsx,mdx}'],
  ['components', 'components/**/*.{js,jsx,ts,tsx,mdx}'],
  ['src', 'src/**/*.{js,jsx,ts,tsx,mdx}'],
  ['public', 'public/**/*.{html,css,js}'],
];
const globs = patterns
  .filter(([dir]) => existsSync(dir))
  .map(([, glob]) => glob)
  .join(' ');
try {
  const out = execSync(
    `shopt -s globstar nullglob; grep -RIl --line-number --fixed-strings "https://app.quickgig.ph" ${globs}`,
    { stdio: ['ignore', 'pipe', 'ignore'], shell: '/bin/bash' },
  )
    .toString()
    .trim();
  if (out) {
    console.error('Found hardcoded app subdomain in:\n' + out);
    process.exit(1);
  }
  console.log('Scan OK: no hardcoded https://app.quickgig.ph in UI code.');
} catch (e) {
  // grep exit 1 => not found; exit 2 => error. We’ll handle both:
  if (e.status === 1) {
    console.log('Scan OK: no hardcoded https://app.quickgig.ph in UI code.');
    process.exit(0);
  }
  console.error('Scan error:', e?.message || e);
  process.exit(2);
}

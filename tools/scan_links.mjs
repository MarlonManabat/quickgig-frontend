import { execSync } from 'node:child_process';
const globs = [
  'app/**/*.{js,jsx,ts,tsx,mdx}',
  'pages/**/*.{js,jsx,ts,tsx,mdx}',
  'components/**/*.{js,jsx,ts,tsx,mdx}',
  'src/**/*.{js,jsx,ts,tsx,mdx}',
  'public/**/*.{html,css,js}',
].join(' ');

function grep(pattern) {
  try {
    const out = execSync(`grep -RIl --line-number --fixed-strings "${pattern}" ${globs}`, { stdio: ['ignore','pipe','ignore'] }).toString().trim();
    return out;
  } catch (e) {
    return ''; // not found
  }
}

// Fail if any UI still links to /app (same-origin), we want the canonical full host
const leftovers = grep('href="/app') || grep("href='/app");
if (leftovers) {
  console.error('Found stale /app links in UI (should be https://app.quickgig.ph):\n' + leftovers);
  process.exit(1);
}
console.log('Scan OK: no stale /app links.');

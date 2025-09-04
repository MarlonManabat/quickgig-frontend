import { readFileSync } from 'node:fs';

const html = readFileSync('landing_public_html/index.html', 'utf8');

const forbidden = [/href="\/find"/, /href="\/post-job"/, /href="\/gigs"(?!\/)/];
const required = [
  'data-testid="nav-browse-jobs"',
  'data-testid="nav-post-job"',
  'data-testid="nav-my-applications"',
  'data-testid="nav-login"',
  'data-testid="hero-browse-jobs"',
  'data-testid="hero-post-job"',
];

let failed = false;
for (const f of forbidden) {
  if (f.test(html)) {
    console.error(`Forbidden anchor pattern found: ${f}`);
    failed = true;
  }
}
for (const r of required) {
  if (!html.includes(r)) {
    console.error(`Missing expected test id: ${r}`);
    failed = true;
  }
}

if (failed) process.exit(1);
console.log('✔ CTA links look good.');

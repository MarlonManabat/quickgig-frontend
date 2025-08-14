import { execSync } from 'node:child_process';

const cmd = 'curl -I --resolve app.quickgig.ph:443:89.116.53.39 https://app.quickgig.ph';
let out = '';
try {
  out = execSync(cmd, { encoding: 'utf8', stdio: 'pipe' });
} catch (e) {
  out = e.stdout ? e.stdout.toString() : '';
  if (out.trim()) console.log(out.trim());
  console.error(e.message);
  process.exit(1);
}

console.log(out.trim());
const match = out.match(/HTTP\/\d\.\d (\d+)/);
if (!match) { console.error('No HTTP status found'); process.exit(1); }
const status = Number(match[1]);
if (status >= 400) { console.error('Status ' + status); process.exit(1); }
console.log('Host OK');

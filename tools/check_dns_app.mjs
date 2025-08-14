import { execSync } from 'node:child_process';

const run = (cmd) => execSync(cmd, { encoding: 'utf8' }).trim();

const a = run('dig +short app.quickgig.ph');
console.log('A app.quickgig.ph\n' + a);
if (!a.split('\n').includes('89.116.53.39')) {
  throw new Error('A app.quickgig.ph missing 89.116.53.39');
}

const cname = run('dig +short CNAME app.quickgig.ph');
console.log('CNAME app.quickgig.ph\n' + cname);
if (cname) {
  throw new Error('CNAME app.quickgig.ph should be empty');
}

console.log('DNS OK');

import { execSync } from 'node:child_process';
function sh(cmd){ return execSync(cmd, { encoding: 'utf8' }).trim(); }

const A = sh('dig +short app.quickgig.ph');
const CNAME = sh('dig +short CNAME app.quickgig.ph');

console.log('A app.quickgig.ph =', A || '(none)');
console.log('CNAME app.quickgig.ph =', CNAME || '(none)');

if (CNAME && /vercel-dns\.com/i.test(CNAME)) {
  throw new Error('CNAME still points to Vercel. Remove it in Hostinger.');
}
if (!/^89\.116\.53\.39$/.test(A)) {
  throw new Error('A record is not 89.116.53.39. Fix Hostinger DNS A app → 89.116.53.39');
}
console.log('DNS OK: A=89.116.53.39 and no Vercel CNAME.');

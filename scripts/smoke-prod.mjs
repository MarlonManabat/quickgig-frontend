import { execSync as sh } from 'node:child_process';
const BASE = process.env.SMOKE_BASE || 'https://quickgig.ph';
function code(u){ return sh(`curl -sS -o /dev/null -w "%{http_code}" "${u}"`).toString().trim(); }
for (const p of ['/', '/login']) {
  const u = `${BASE}${p}?legacy=1`;
  const c = code(u);
  console.log(u,'->',c);
  if (+c>=400) process.exit(1);
  const html = sh(`curl -sS "${u}"`).toString();
  const assets=[...new Set((html.match(/["'](\/legacy[^"' >]+)["']/gi)||[]).map(s=>s.slice(1,-1)))];
  for (const a of assets) {
    const cu = `${BASE}${a}`;
    const cc = code(cu);
    console.log(' ',a,'->',cc);
    if (+cc>=400) { console.error('MISS',a); process.exit(1); }
  }
}
const head = sh(`curl -sSI "${BASE}/legacy/fonts/LegacySans.woff2"`).toString();
console.log(head.split('\n').filter(l=>/HTTP\\/|content-type|content-length/i.test(l)).join('\n'));
console.log('Smoke OK ✅');

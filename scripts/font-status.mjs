import { execSync as sh } from 'child_process';
const BASE=process.env.SMOKE_BASE||'https://quickgig.ph';
try{
  const raw=sh(`curl -fsSL "${BASE}/api/legacy-selftest"`).toString();
  const j=JSON.parse(raw); const k='public/legacy/fonts/LegacySans.woff2'; const f=j.files?.[k]||{};
  console.log('Prod font:',k); console.log(' exists:',f.exists,' http:',f.httpStatus,' size:',f.size,' sha256:',f.sha256);
}catch(e){ console.error('Fetch failed:',e?.message||e); process.exit(1); }

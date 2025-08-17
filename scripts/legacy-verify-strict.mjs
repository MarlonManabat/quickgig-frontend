import fs from 'fs'; import path from 'path';
const root=process.cwd();
const must=['public/legacy/index.fragment.html','public/legacy/login.fragment.html','public/legacy/styles.css'];
const bad=[/lorem ipsum/i,/\bplaceholder\b/i,/\blipsum\b/i,/\bTODO\b/i];
const no=[/<script\b/i,/\bon[a-z]+\s*=/i,/javascript\s*:/i];
const headNeeds=[/rel=["']icon["']/i,/og:image/i,/twitter:card/i,/rel=["']preload["'][^>]+LegacySans\.woff2/i];
let errs=[];
for(const f of must){ if(!fs.existsSync(path.join(root,f))) errs.push(`Missing: ${f}`); }
for(const f of must.filter(f=>f.endsWith('.html'))){
  const t=fs.readFileSync(path.join(root,f),'utf8');
  for(const rx of headNeeds) if(!rx.test(t)) errs.push(`Missing meta/preload in ${f}: ${rx}`);
  for(const rx of bad) if(rx.test(t)) errs.push(`Placeholder in ${f}: ${rx}`);
  for(const rx of no) if(rx.test(t)) errs.push(`Disallowed in ${f}: ${rx}`);
  const refs=[...new Set((t.match(/["'](\/legacy[^"' >]+)["']/gi)||[]).map(s=>s.slice(1,-1)))];
  for(const r of refs){ const disk=path.join(root,'public',r); if(!fs.existsSync(disk)) errs.push(`Missing asset referenced: ${r}`); }
}
const font='public/legacy/fonts/LegacySans.woff2';
if(!fs.existsSync(font)) errs.push('Missing font: LegacySans.woff2');
else { const sz=fs.statSync(font).size; if(sz<10*1024) errs.push(`Font too small (likely placeholder): ${sz} bytes; need ≥ 10240`); }
const css=fs.readFileSync(path.join(root,'public/legacy/styles.css'),'utf8');
for(const rx of bad) if(rx.test(css)) errs.push(`Placeholder in styles.css: ${rx}`);
for(const rx of no) if(rx.test(css)) errs.push(`Disallowed in styles.css: ${rx}`);
if(errs.length){ console.error('legacy:verify:strict failed:\n- '+errs.join('\n- ')); process.exit(1); }
console.log('legacy:verify:strict OK');

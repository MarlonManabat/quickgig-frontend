import fs from 'fs'; import path from 'path';
const src = process.env.LEGACY_FONT_SRC;
if(!src) { console.error('LEGACY_FONT_SRC is required'); process.exit(2); }
const dstDir = path.join(process.cwd(),'public','legacy','fonts');
const dst = path.join(dstDir,'LegacySans.woff2');
fs.mkdirSync(dstDir,{recursive:true});
fs.copyFileSync(src,dst);
const stat=fs.statSync(dst);
if(stat.size < 1024){ console.error(`Font looks too small (${stat.size} bytes). Did you pass the real .woff2?`); process.exit(3); }
console.log(`Installed LegacySans.woff2 (${stat.size} bytes) → ${dst}`);

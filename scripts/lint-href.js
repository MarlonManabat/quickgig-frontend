const fs = require('fs');
const path = require('path');

const SRC_DIRS = ['pages','components'];

const offenders = [];
function scan(file) {
  const txt = fs.readFileSync(file, 'utf8');
  // raw bracketed href in <Link> or string push()
  const badLink = /<Link[^>]*href\s*=\s*["'`](?:[^"'`]*\/\[[^"'`]+\][^"'`]*)["'`]/g;
  const badPush = /router\.push\(\s*["'`](?:[^"'`]*\/\[[^"'`]+\][^"'`]*)["'`]\s*\)/g;
  if (badLink.test(txt) || badPush.test(txt)) offenders.push(file);

  // object push with pathname but no query
  const badObj = /router\.push\(\s*\{\s*pathname:\s*["'`](?:[^"'`]*\/\[[^"'`]+\][^"'`]*)["'`]\s*(?:,\s*query\s*:\s*\{[^}]*\})?\s*\}\s*\)/g;
  const m = txt.match(badObj);
  if (m?.some(s => !/query\s*:\s*\{[^}]*\}/.test(s))) offenders.push(file);
}

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p);
    else if (/\.(t|j)sx?$/.test(name)) scan(p);
  }
}

for (const d of SRC_DIRS) if (fs.existsSync(d)) walk(d);

if (offenders.length) {
  console.error('Dynamic-route href issues in:');
  offenders.forEach(f => console.error(' -', f));
  process.exit(1);
}
console.log('href-safety: OK');

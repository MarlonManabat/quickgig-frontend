import fs from 'fs';

function readJSON(path) {
  try {
    return JSON.parse(fs.readFileSync(path, 'utf8'));
  } catch {
    return null;
  }
}

const links = readJSON('reports/cta-links.json') || [];
console.log(`Links tested: ${links.length}`);
const failing = links.filter(l => typeof l.status === 'number' && (l.status < 200 || l.status >= 400));
if (failing.length) {
  console.log('Failing links:');
  for (const f of failing) console.log(`- ${f.label} -> ${f.href} (${f.status})`);
}

const consoles = readJSON('reports/console-errors.json') || [];
for (const c of consoles) {
  if (c.errors && c.errors.length) {
    console.log(`Console errors on ${c.page}:`);
    for (const e of c.errors) console.log(`  ${e}`);
  }
}

const api = readJSON('reports/api.json');
if (api) console.log(`API: ${api.status}`);
const cors = readJSON('reports/cors.json');
if (cors) console.log(`CORS: ${cors.status}`);

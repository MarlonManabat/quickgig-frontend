import fs from 'fs';

const base = (process.env.BASE || 'https://quickgig.ph').replace(/\/$/, '');
fs.mkdirSync('reports', { recursive: true });

async function check(u) {
  const r = await fetch(u, { redirect: 'follow' });
  console.log(`${u} -> ${r.url} (${r.status})`);
  if (r.status >= 400) throw new Error(`${u} returned ${r.status}`);
  return { url: u, final: r.url, status: r.status };
}

(async () => {
  const results = [];
  results.push(await check(base));
  results.push(await check('https://app.quickgig.ph'));
  fs.writeFileSync('reports/app.json', JSON.stringify(results, null, 2));
  console.log('App OK');
})();

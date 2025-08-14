const base = (process.env.BASE || '').replace(/\/$/, '');
if (!base) { console.warn('No BASE provided; skipping asset check'); process.exit(0); }

const fetchImpl = globalThis.fetch;

function pickAssets(html) {
  const css = new Set(), js = new Set();
  const re = /(href|src)=["'](\/[^"']+\.(css|js))["']/gi;
  let m; let count = 0;
  while ((m = re.exec(html)) && count < 12) {
    const url = m[2];
    if (url.endsWith('.css')) css.add(url);
    else if (url.endsWith('.js')) js.add(url);
    count++;
  }
  return { css: Array.from(css), js: Array.from(js) };
}

(async () => {
  const page = await fetchImpl(base + '/', { redirect: 'manual' });
  if (page.status < 200 || page.status >= 400) throw new Error(`GET / ${page.status}`);
  const html = await page.text();
  const assets = pickAssets(html);

  if (!assets.css.length && !assets.js.length) {
    console.log('No absolute .css/.js assets detected; nothing to check. (OK)');
    process.exit(0);
  }

  const toCheck = [];
  if (assets.css[0]) toCheck.push(assets.css[0]);
  if (assets.js[0])  toCheck.push(assets.js[0]);

  for (const a of toCheck) {
    const r = await fetchImpl(base + a, { redirect: 'manual' });
    if (r.status < 200 || r.status >= 400) throw new Error(`Asset ${a} failed with ${r.status}`);
  }
  console.log('App assets OK');
})();


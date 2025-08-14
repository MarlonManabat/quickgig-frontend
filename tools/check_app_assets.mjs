const base = (process.env.BASE || '').replace(/\/\$/, '');
if (!base) { console.warn('No BASE provided; skipping asset check'); process.exit(0); }

const fetchImpl = globalThis.fetch;

function pickAssets(html) {
  // naive scrape: collect first few absolute assets (href/src starting with "/")
  const urls = new Set();
  const re = /(href|src)=["'](\/[^"']+\.(?:css|js))["']/gi;
  let m; let count = 0;
  while ((m = re.exec(html)) && count < 6) { urls.add(m[2]); count++; }
  return Array.from(urls);
}

(async () => {
  const page = await fetchImpl(base + '/app', { redirect: 'manual' });
  if (page.status < 200 || page.status >= 400) {
    throw new Error(`GET /app ${page.status}`);
  }
  const html = await page.text();
  const assets = pickAssets(html);
  if (!assets.length) {
    console.log('No absolute .css/.js assets detected; nothing to check. (OK)');
    process.exit(0);
  }

  for (const a of assets) {
    const r = await fetchImpl(base + a, { redirect: 'manual' });
    if (r.status < 200 || r.status >= 400) {
      throw new Error(`Asset ${a} failed with ${r.status}`);
    }
  }
  console.log('App assets OK');
})();

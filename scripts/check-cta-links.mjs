const base = (process.env.CTA_BASE || 'http://localhost:3000').replace(/\/$/, '');
const pages = ['/browse-jobs'];

const results = [];

const CTA_RE = /<a[^>]*data-cta="([^"]+)"[^>]*href="([^"]+)"/g;

for (const pagePath of pages) {
  const res = await fetch(base + pagePath);
  const html = await res.text();
  for (const match of html.matchAll(CTA_RE)) {
    const id = match[1];
    const href = match[2];
    const url = base + href;
    const resp = await fetch(url, { redirect: 'manual' });
    const status = resp.status;
    if (status === 200) {
      results.push([id, href, status, 'OK']);
      continue;
    }
    if (status === 302) {
      const loc = resp.headers.get('location') || '';
      if (/^\/login\?next=/.test(loc)) {
        results.push([id, href, status, 'OK']);
        continue;
      }
    }
    results.push([id, href, status, 'FAIL']);
  }
}

console.table(results);
if (results.some(r => r[3] !== 'OK')) process.exit(1);

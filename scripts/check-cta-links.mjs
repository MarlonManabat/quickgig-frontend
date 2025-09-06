const base = (process.env.CTA_BASE || 'http://localhost:3000').replace(/\/$/, '');
const pages = ['/', '/browse-jobs', '/tickets'];

const results = [];

const CTA_RE = /<a[^>]*data-cta="([^"]+)"[^>]*href="([^"]+)"/g;

function isAuthRoute(path) {
  return ['/post-job', '/applications'].includes(path);
}

for (const pagePath of pages) {
  const res = await fetch(base + pagePath);
  const html = await res.text();
  for (const match of html.matchAll(CTA_RE)) {
    const id = match[1];
    const href = match[2];
    const url = base + href;
    const resp = await fetch(url, { redirect: 'manual' });
    const status = resp.status;
    if (status >= 400) {
      results.push([id, href, status, 'FAIL']);
      continue;
    }
    if (status >= 300 && isAuthRoute(href)) {
      const loc = resp.headers.get('location') || '';
      if (!loc.includes('/login?next=')) {
        results.push([id, href, status, 'MISSING next']);
        continue;
      }
    }
    results.push([id, href, status, 'OK']);
  }
}

console.table(results);
if (results.some(r => r[3] !== 'OK')) process.exit(1);

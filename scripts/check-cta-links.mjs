const base = (process.env.CTA_BASE || 'http://localhost:3000').replace(/\/$/, '');
const pages = ['/browse-jobs'];

const results = [];

const CTA_RE = /<a[^>]*data-cta="([^"]+)"[^>]*href="([^"]+)"/g;

const isAuthGated = (href) =>
  href.startsWith('/applications') || href.startsWith('/post-job');

for (const pagePath of pages) {
  const res = await fetch(base + pagePath);
  const html = await res.text();
  for (const match of html.matchAll(CTA_RE)) {
    const id = match[1];
    const href = match[2];
    const url = base + href;
    const resp = await fetch(url, { redirect: 'manual' });
    const ok =
      resp.status === 200 ||
      resp.status === 302 ||
      (resp.status === 404 && isAuthGated(href)) ||
      (resp.url && resp.url.includes('/login?next='));
    results.push([id, href, resp.status, ok ? 'OK' : 'FAIL']);
  }
}

console.table(results);
if (results.some(r => r[3] !== 'OK')) process.exit(1);

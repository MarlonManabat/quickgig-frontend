const DEFAULT_BASES = [
  'https://quickgig.ph',
  'https://app.quickgig.ph',
  'https://preview-quickgig.vercel.app',
  'https://preview-app.vercel.app',
];

const pages = ['/browse-jobs'];
const CTA_RE = /<a[^>]*data-cta="([^"]+)"[^>]*href="([^"]+)"/g;

const bases = (process.env.BASE_URLS || DEFAULT_BASES.join(','))
  .split(',')
  .map((u) => u.trim().replace(/\/$/, ''))
  .filter(Boolean);

const links = new Set();

for (const base of bases) {
  for (const page of pages) {
    try {
      const res = await fetch(base + page);
      const html = await res.text();
      for (const match of html.matchAll(CTA_RE)) {
        const href = match[2];
        const url = new URL(href, base).href;
        links.add(url);
      }
    } catch (err) {
      console.error(`Failed to fetch ${base + page}:`, err);
      links.add(base + page);
    }
  }
}

const red = (s) => `\x1b[31m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;
const green = (s) => `\x1b[32m${s}\x1b[0m`;

async function check(url) {
  try {
    // Do NOT follow redirects – we want to see 3xx and fail on them.
    let resp = await fetch(url, { method: 'HEAD', redirect: 'manual' });
    if (resp.status === 405 || resp.status === 403) {
      resp = await fetch(url, { method: 'GET', redirect: 'manual' });
    }
    const isRedirect = resp.status >= 300 && resp.status < 400;
    // If your caller expects a status, keep returning the status,
    // but treat 3xx as a failure later.
    return isRedirect ? 302 : resp.status;
  } catch (err) {
    return 0;
  }
}

const results = [];

for (const url of links) {
  const status = await check(url);
  const failed = status >= 400 || (status >= 300 && status < 400);
  results.push({ url, status, failed });
}

const bad = results.filter((r) => r.status < 200 || r.failed);

if (bad.length) {
  console.log(red('Non-2xx responses:'));
  for (const r of bad) {
    const color = r.status >= 400 || r.status === 0 ? red : yellow;
    console.log(`${color(r.status)} ${r.url}`);
  }
} else {
  console.log(green('All links returned 2xx responses'));
}

process.exit(bad.some((r) => r.failed || r.status === 0) ? 1 : 0);


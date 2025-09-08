const raw = process.env.BASE_URLS || "https://quickgig.ph,https://app.quickgig.ph";
const BASE_URLS = raw.split(",").map((s) => s.trim().replace(/\/$/, "")).filter(Boolean);

const pages = ["/browse-jobs"];
const CTA_RE = /<a[^>]*data-cta="([^"]+)"[^>]*href="([^"]+)"/g;

const links = new Set();

for (const base of BASE_URLS) {
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

const ALLOWED = new Set([
  '/browse-jobs',
  '/post-job',
  '/applications',
  '/tickets',
  '/login',
  '/logout',
  '/signup',
  '/tickets/buy',
]);

async function check(url) {
  try {
    const resp = await fetch(url, { method: 'GET', redirect: 'follow' });
    const finalUrl = resp.url;
    const path = new URL(finalUrl).pathname;
    const legacy = ![...ALLOWED].some((p) => path === p || path.startsWith(p + '/')) && !path.startsWith('/jobs/');
    return { status: resp.status, legacy };
  } catch (err) {
    return { status: 0, legacy: true };
  }
}

// Note: "legacy" means the final path isn't in our preferred allowlist.
// This can include legitimate auth redirects (e.g., /login → Supabase authorize),
// which SHOULD NOT fail the build. We only fail on hard HTTP errors (>= 400)
// or network errors (status === 0). Keep "legacy" for reporting only.
const results = [];
for (const url of links) {
  const { status, legacy } = await check(url);
  const failed = (status === 0) || status >= 400; // do not include `legacy`
  results.push({ url, status, failed, legacy });
}

const bad = results.filter((r) => r.status < 200 || r.failed);

if (bad.length) {
  console.log(red('Non-2xx responses:'));
  for (const r of bad) {
    const color = r.status >= 400 || r.status === 0 || r.legacy ? red : yellow;
    const note = r.legacy ? ' legacy-path' : '';
    console.log(`${color(r.status)} ${r.url}${note}`);
  }
} else {
  console.log(green('All links returned 2xx responses'));
}

process.exit(bad.some((r) => r.failed || r.status === 0) ? 1 : 0);


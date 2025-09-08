const DEFAULT_BASES = ["https://quickgig.ph", "https://app.quickgig.ph"];
// In CI we run a local Next server; prefer localhost unless BASE_URLS is provided.
const CI_DEFAULT = process.env.CI ? "http://localhost:3000" : "";
const rawBases = (process.env.BASE_URLS || CI_DEFAULT || DEFAULT_BASES.join(",")).trim();
const BASE_URLS = rawBases
  .split(",")
  .map((s) => s.trim().replace(/\/$/, ""))
  .filter(Boolean);

const pages = ["/browse-jobs"];
const CTA_RE = /<a[^>]*data-cta="([^"]+)"[^>]*href="([^"]+)"/g;

const links = new Set();

for (const base of BASE_URLS) {
  for (const page of pages) {
    try {
      const { url: dest, text } = await fetchFirstHop(base + page);
      for (const match of (text || "").matchAll(CTA_RE)) {
        const href = match[2];
        const url = new URL(href, dest).href;
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

// Only inspect the FIRST HOP to avoid landing on auth providers or login pages.
async function fetchFirstHop(url, opts = {}) {
  const res = await fetch(url, { redirect: 'manual', ...opts });
  const location = res.headers?.get?.('location');
  const nextUrl = location ? new URL(location, url).toString() : url;
  const text = await (res.status >= 200 && res.status < 400 ? res.text() : Promise.resolve(""));
  return { status: res.status, url: nextUrl, text };
}

function isAuthRedirect(u) {
  try {
    const p = new URL(u).pathname;
    if (p.startsWith('/login')) return true;
    if (p.startsWith('/api/auth/pkce')) return true;
    if (p.startsWith('/auth') || p.includes('/authorize')) return true; // supabase/oauth-ish
    return false;
  } catch {
    return false;
  }
}

async function check(url) {
  try {
    const resp = await fetchFirstHop(url);
    const path = new URL(resp.url).pathname;
    const legacy = ![...ALLOWED].some((p) => path === p || path.startsWith(p + '/')) && !path.startsWith('/jobs/');
    return { status: resp.status, legacy, nextUrl: resp.url };
  } catch (err) {
    return { status: 0, legacy: true, nextUrl: url };
  }
}

// Note: "legacy" means the final path isn't in our preferred allowlist.
// This can include legitimate auth redirects (e.g., /login → Supabase authorize),
// which SHOULD NOT fail the build. We only fail on hard HTTP errors (>= 400)
// or network errors (status === 0). Keep "legacy" for reporting only.
const results = [];
for (const url of links) {
  const { status, legacy, nextUrl } = await check(url);
  const failed = status === 0 || (status >= 400 && !isAuthRedirect(nextUrl));
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


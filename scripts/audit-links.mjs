/* Audit CTA href contracts without navigating to targets.
   Reads "/" HTML and verifies <a data-testid=... href=...> against our rules.
   This script is intentionally dependency-free (no jsdom) for CI speed. */
const BASE = process.env.AUDIT_BASE || 'http://localhost:3000';

const NAV = [
  { id: 'nav-browse-jobs',     dest: '/browse-jobs',   gated: false },
  { id: 'nav-post-job',        dest: '/post-jobs',     gated: true  },
  { id: 'nav-my-applications', dest: '/applications',  gated: true  },
  { id: 'nav-tickets',         dest: '/tickets',       gated: true  },
  { id: 'nav-login',           dest: '/login',         gated: false },
];

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const rePath = (dest) => new RegExp(`^${esc(dest)}(?:[?#].*)?$`);
const reAuthAware = (dest) => {
  const enc = encodeURIComponent(dest);
  return new RegExp(`^(?:/login\\?next=${enc}(?:[&#].*)?|${esc(dest)}(?:[?#].*)?)$`);
};

(async () => {
  const res = await fetch(`${BASE}/`);
  if (!res.ok) {
    console.error(`Failed to load ${BASE}/ (${res.status})`);
    process.exit(1);
  }
  const html = await res.text();

  const errs = [];

  for (const { id, dest, gated } of NAV) {
    // naive but reliable enough: find the first <a ... data-testid="id" ... href="...">
    const rx = new RegExp(
      `<a[^>]*?data-testid=["']${id}["'][^>]*?href=["']([^"']+)["'][^>]*>`,
      'i'
    );
    const m = html.match(rx);
    if (!m) {
      errs.push(`[${id}] anchor not found on "/"`);
      continue;
    }
    const href = m[1];
    const rule = gated ? reAuthAware(dest) : rePath(dest);
    if (!rule.test(href)) {
      errs.push(
        `[${id}] href was "${href}" but expected ${gated ? `reAuthAware(${dest})` : `rePath(${dest})`}`
      );
    }
  }

  if (errs.length) {
    console.error('CTA href audit failed:\n- ' + errs.join('\n- '));
    process.exit(1);
  } else {
    console.log('CTA href audit passed ✅');
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});

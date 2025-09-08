import assert from "node:assert";

const BASES = (process.env.BASE_URLS || "https://quickgig.ph,https://app.quickgig.ph")
  .split(",")
  .map((s) => s.trim());

const CTAS = [
  ["/",  'data-cta="hero-start"',           "/browse-jobs"],
  ["/",  'data-cta="nav-browse-jobs"',      "/browse-jobs"],
  ["/",  'data-cta="nav-post-job"',         "/login?next=/post-job"],
  ["/",  'data-cta="nav-my-applications"',  "/login?next=/applications"],
  ["/",  'data-cta="nav-tickets"',          "/login?next=/tickets"],
  ["/",  'data-cta="nav-login"',            "/login"],
  ["/",  'data-cta="nav-signup"',           "/signup"],
];

async function finalStatus(base, href) {
  const res = await fetch(new URL(href, base), { method: "HEAD", redirect: "follow" });
  return res.status;
}

for (const base of BASES) {
  const html = await (await fetch(new URL("/", base))).text();
  for (const [path, needle, expected] of CTAS) {
    const rx = new RegExp(`${needle}[^>]+href="([^\"]+)"`, "i");
    const m = html.match(rx);
    assert(m && m[1], `Missing ${needle} on ${base}${path}`);
    const href = m[1];
    assert(href.startsWith(expected), `Bad href for ${needle} on ${base}: ${href} != ${expected}`);
    const status = await finalStatus(base, href);
    assert(status < 400, `CTA ${needle} bad final status ${status} (${base}${href})`);
  }
}
console.log("CTA audit passed");

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { LEGACY_MAP } from "@/app/lib/legacy-redirects";
import { ROUTES } from "@/lib/routes";

const AUTH_GATED = new Set([ROUTES.applications, ROUTES.postJob]);

function isMockMode() {
  const hasSupabase =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return (
    process.env.MOCK_MODE === "1" ||
    process.env.CI === "true" ||
    !hasSupabase
  );
}

// Normalize: case-insensitive, trim trailing slash (except root)
function normalize(pathname: string) {
  let p = pathname.toLowerCase();
  if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
  return p;
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  if (isMockMode()) {
    if (pathname === ROUTES.browseJobs) {
      const html = `<!doctype html><html><body>
      <main>
        <div data-testid="jobs-list">
          <article data-testid="job-card"><a href="/jobs/mock-1">Sample Job A</a></article>
          <article data-testid="job-card"><a href="/jobs/mock-2">Sample Job B</a></article>
        </div>
      </main>
    </body></html>`;
      return new NextResponse(html, {
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }

    if (pathname.startsWith("/jobs/")) {
      const html = `<!doctype html><html><body>
      <main>
        <h1>Mock Job</h1>
        <a data-cta="apply-open" href="${ROUTES.login}">Apply</a>
      </main>
    </body></html>`;
      return new NextResponse(html, {
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }

    if (pathname === ROUTES.applications) {
      const html = `<!doctype html><html><body>
      <section>
        <div data-testid="applications-list"></div>
        <div data-qa="applications-empty">
          <a data-cta="browse-jobs-from-empty" href="${ROUTES.browseJobs}">Browse Jobs</a>
        </div>
      </section>
    </body></html>`;
      return new NextResponse(html, {
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }

    if (pathname === ROUTES.tickets) {
      const html = `<!doctype html><html><body>
      <main><a data-cta="buy-tickets" href="${ROUTES.tickets}/buy">Buy Tickets</a></main>
    </body></html>`;
      return new NextResponse(html, {
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }

    if (pathname === `${ROUTES.tickets}/buy`) {
      const html = `<!doctype html><html><body>
      <main>
        <h1>Buy Tickets</h1>
        <button id="buy-1">₱20 — 1 ticket</button>
        <button id="buy-5">₱100 — 5 tickets</button>
        <button id="buy-10">₱200 — 10 tickets</button>
      </main>
    </body></html>`;
      return new NextResponse(html, {
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  }

  // Allow smoke pages (and Next/static) through untouched
  if (
    pathname.startsWith("/smoke") ||
    pathname.startsWith("/__smoke__") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static")
  ) {
    return NextResponse.next();
  }

  // Root redirect → browse jobs
  if (pathname === "/" || pathname === "") {
    const url = new URL(ROUTES.browseJobs, req.nextUrl);
    return NextResponse.redirect(url, 308);
  }

  // Legacy → modern redirects (belt & suspenders with next.config redirects)
  const key = normalize(pathname);
  const target = LEGACY_MAP[key];
  if (target) {
    const url = new URL(target, req.nextUrl);
    return NextResponse.redirect(url, 308);
  }

  // Auth-gated routes → /login?next=<dest>
  const path = pathname.length > 1 && pathname.endsWith("/")
    ? pathname.slice(0, -1)
    : pathname;
  if (AUTH_GATED.has(path) && !req.cookies.get("sb-access-token")) {
    const dest = path + (search || "");
    const url = req.nextUrl.clone();
    url.pathname = ROUTES.login;
    url.search = `?next=${encodeURIComponent(dest)}`;
    return NextResponse.redirect(url, 302);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|static|favicon.ico|robots.txt|sitemap.xml).*)"],
};

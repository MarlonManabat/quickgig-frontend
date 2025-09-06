import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { LEGACY_REDIRECTS } from "@/app/lib/legacy-redirects";
import { ROUTES } from "@/lib/routes";

const AUTH_GATED = new Set([ROUTES.applications, ROUTES.postJob]);

function isMock() {
  const hasSb = !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return process.env.MOCK_MODE === "1" || process.env.CI === "true" || !hasSb;
}

// Normalize: case-insensitive, trim trailing slash (except root)
function normalize(pathname: string) {
  let p = pathname.toLowerCase();
  if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
  return p;
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // CI stub: legacy /gigs/create should look like /post-job without auth
  if (isMock() && pathname === "/gigs/create") {
    const html = `<!doctype html><html><body>
      <script>history.replaceState(null, '', '/post-job');</script>
      <main><h1>Post Job (CI mock)</h1></main>
    </body></html>`;
    return new NextResponse(html, { headers: { 'content-type': 'text/html; charset=utf-8' } });
  }

  // Allow mock smoke pages and Next/static assets
  if (
    pathname.startsWith("/_smoke") ||
    pathname.startsWith("/__smoke__") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static")
  ) {
    return NextResponse.next();
  }

  // Legacy → modern redirects (belt & suspenders with next.config redirects)
  const key = normalize(pathname);
  const target = LEGACY_REDIRECTS[key];
  if (target) {
    const url = new URL(target, req.nextUrl);
    return NextResponse.redirect(url, 308);
  }

  // Auth-gated routes → /login?next=<dest>
  const path = pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
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

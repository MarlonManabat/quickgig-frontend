import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { LEGACY_MAP } from "@/app/lib/legacy-redirects";
import { ROUTES } from "@/lib/routes";

const AUTH_GATED = new Set([ROUTES.applications, ROUTES.postJob]);

// Normalize: case-insensitive, trim trailing slash (except root)
function normalize(pathname: string) {
  let p = pathname.toLowerCase();
  if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
  return p;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

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
  if (AUTH_GATED.has(pathname) && !req.cookies.get("sb-access-token")) {
    const url = new URL(
      `${ROUTES.login}?next=${encodeURIComponent(pathname)}`,
      req.url,
    );
    return NextResponse.redirect(url, 302);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|static|favicon.ico|robots.txt|sitemap.xml).*)"],
};

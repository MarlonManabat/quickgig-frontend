import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Deterministic gating: only /applications in non-production/CI unless qg_auth=1
const isPreview = process.env.CI === "true" || process.env.VERCEL_ENV !== "production";

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Allow auth/pkce and assets to pass through
  if (pathname.startsWith("/api/auth/pkce") || pathname.startsWith("/_next") || pathname.startsWith("/favicon")) {
    return NextResponse.next();
  }

  if (isPreview && pathname.startsWith("/applications")) {
    const authed = req.cookies.get("qg_auth")?.value === "1";
    if (!authed) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.search = `?next=${encodeURIComponent(pathname + search)}`;
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  // run on all app routes
  matcher: ["/((?!api|_next|static|.*\\..*).*)"],
};

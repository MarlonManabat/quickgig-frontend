import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Gate both /applications and /my-applications at the edge so unauthenticated
// requests redirect before the page is rendered (matches agents contract).
export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const path = url.pathname;
  const isGated =
    path.startsWith("/applications") || path.startsWith("/my-applications");
  if (!isGated) return NextResponse.next();

  // Treat presence of any known auth cookie as "signed in".
  const c = req.cookies;
  const authed =
    c.get("qg_auth") ||
    c.get("auth") ||
    c.get("session") ||
    c.get("next-auth.session-token") ||
    c.get("sb:token");

  if (!authed) {
    const dest = new URL("/login", url.origin);
    // Preserve full original destination
    dest.searchParams.set("next", url.pathname + url.search);
    return NextResponse.redirect(dest);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/applications/:path*", "/my-applications/:path*"],
};

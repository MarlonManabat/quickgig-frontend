import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { hasAuthCookieHeader } from "@/lib/auth/cookies";

// Gate both /applications and /my-applications at the edge so unauthenticated
// requests redirect before the page is rendered (matches agents contract).
export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const path = url.pathname;
  const isGated =
    path.startsWith("/applications") || 
    path.startsWith("/my-applications");
  if (!isGated) return NextResponse.next();

  const authed = hasAuthCookieHeader(req.headers.get("cookie"));

  if (!authed) {
    const dest = new URL("/login", url.origin);
    const fullPath = url.search ? `${path}${url.search}` : path;
    dest.searchParams.set("next", fullPath);
    return NextResponse.redirect(dest);
  }
  return NextResponse.next();
}

export const config = {
  // Protected routes that require authentication
  matcher: [
    "/applications/:path*", 
    "/my-applications/:path*"
  ],
};

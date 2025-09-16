import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAMES } from "@/lib/constants";

// Gate both /applications and /my-applications at the edge so unauthenticated
// requests redirect before the page is rendered (matches agents contract).
export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const path = url.pathname;
  const isGated =
    path.startsWith("/applications") || path.startsWith("/my-applications");
  if (!isGated) return NextResponse.next();

  const authed = AUTH_COOKIE_NAMES.some((name) => {
    const value = req.cookies.get(name)?.value;
    return typeof value === "string" && value.length > 0;
  });

  if (!authed) {
    const dest = new URL("/login", url.origin);
    const fullPath = url.search ? `${path}${url.search}` : path;
    dest.searchParams.set("next", fullPath);
    return NextResponse.redirect(dest);
  }
  return NextResponse.next();
}

export const config = {
  // Both /applications and /my-applications are auth-gated. Keep gating at the Edge
  // so unauthenticated users are redirected before any page renders.
  matcher: ["/applications/:path*", "/my-applications/:path*"],
};

import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Gate /applications unless a simple preview cookie is set
  if (pathname.startsWith("/applications")) {
    const authed = req.cookies.get("qg_auth")?.value === "1";
    if (!authed) {
      const nextUrl = req.nextUrl.clone();
      nextUrl.pathname = "/login";
      nextUrl.search = `?next=${encodeURIComponent(pathname + (search || ""))}`;
      return NextResponse.redirect(nextUrl, 302);
    }
  }

  // Otherwise allow through.
  return NextResponse.next();
}

export const config = {
  // Run on all app pages we care about
  matcher: ["/applications/:path*", "/applications"],
};

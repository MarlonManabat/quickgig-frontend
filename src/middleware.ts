import { NextResponse, type NextRequest } from "next/server";

const AUTH_COOKIES = [
  "sb-access-token",
  "sb:token",
  "next-auth.session-token",
  "qg_session",
  "supabase-auth-token",
];

function hasSession(req: NextRequest): boolean {
  return AUTH_COOKIES.some((n) => req.cookies.has(n) || !!req.cookies.get(n));
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Gate Applications for guests (dev/CI too)
  if (pathname.startsWith("/applications") && !hasSession(req)) {
    const next = encodeURIComponent(pathname + (search || ""));
    // Redirect to local /login (stable in CI); product PKCE remains valid in prod
    return NextResponse.redirect(new URL(`/login?next=${next}`, req.url));
  }

  return NextResponse.next();
}

export const config = { matcher: ["/applications/:path*"] };

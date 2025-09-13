// src/middleware.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  // In CI we don't hit real auth; avoid PKCE redirects/loops
  if (process.env.CI === 'true') {
    const url = new URL(req.url);

    // No-op PKCE endpoints so Playwright doesn't crash
    if (url.pathname.startsWith('/api/auth/pkce/')) {
      return new NextResponse(null, { status: 204 });
    }

    // Gate /applications to /login without touching external auth
    if (url.pathname === '/applications') {
      return NextResponse.redirect(new URL('/login', req.url), 302);
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/applications', '/api/auth/pkce/:path*'],
};

// src/middleware.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const url = new URL(req.url);
  const isCI = process.env.CI === 'true' || process.env.NODE_ENV !== 'production';

  // Redirect home to /browse-jobs only in production
  if (!isCI && url.pathname === '/') {
    url.pathname = '/browse-jobs';
    return NextResponse.redirect(url);
  }

  // CI helpers: avoid PKCE loops and gate /applications to /login
  if (process.env.CI === 'true') {
    if (url.pathname.startsWith('/api/auth/pkce/')) {
      return new NextResponse(null, { status: 204 });
    }
    if (url.pathname === '/applications') {
      return NextResponse.redirect(new URL('/login', req.url), 302);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/applications', '/api/auth/pkce/:path*'],
};

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const isCI = process.env.CI === 'true' || process.env.NODE_ENV !== 'production';

  // Help CI: don't fetch external auth route
  if (isCI && pathname.startsWith('/api/auth/pkce/')) {
    return new NextResponse(null, { status: 204 });
  }

  // Gate /applications for unauthenticated users
  if (pathname.startsWith('/applications')) {
    const authed = req.cookies.get('qg_auth')?.value === '1';
    if (!authed) {
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      url.search = `?next=${encodeURIComponent(pathname + (search || ''))}`;
      return NextResponse.redirect(url);
    }
  }

  // Allow everything else through
  return NextResponse.next();
}

// Match only pages we actually need
export const config = {
  matcher: ['/applications/:path*', '/api/auth/pkce/:path*'],
};


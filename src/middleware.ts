import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  // Gate Applications for unauthenticated users; leave everything else alone
  if (pathname.startsWith('/applications')) {
    const authed = req.cookies.get('qg_auth')?.value === '1';
    if (!authed) {
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      url.search = `?next=${encodeURIComponent(pathname + (search || ''))}`;
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/applications'],
};

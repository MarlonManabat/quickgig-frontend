import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { env } from '@/config/env';

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  if (/^\/(dashboard|settings|messages|payment)(\/|$)/.test(pathname)) {
    const token = req.cookies.get(env.JWT_COOKIE_NAME)?.value;
    if (!token) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = '/login';
      loginUrl.searchParams.set('next', pathname + search);
      return NextResponse.redirect(loginUrl);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api/|_next/|legacy/|.*\\..*).*)'],
};

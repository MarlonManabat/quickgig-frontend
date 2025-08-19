import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { env } from './src/config/env';
import { rateLimit } from './src/middleware/rateLimit';

const PROTECTED_PREFIXES = ['/dashboard', '/messages', '/applications', '/settings'];

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  if (
    env.NEXT_PUBLIC_ENABLE_SECURITY_AUDIT &&
    (pathname.startsWith('/api') || pathname.startsWith('/status/ping'))
  ) {
    const limited = rateLimit(req);
    if (limited) return limited;
  }

  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/public') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const hasSession = req.cookies.has(env.JWT_COOKIE_NAME);
  if (!hasSession && PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname + search);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next|public|.*\\..*).*)'],
};

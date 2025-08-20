import { NextResponse, type NextRequest } from 'next/server';
import { env } from '@/config/env';

export async function middleware(req: NextRequest) {
  const p = req.nextUrl.pathname;
  if (p.startsWith('/api') || p.startsWith('/socket.io')) return NextResponse.next();

  if (p.startsWith('/account')) {
    const r = await fetch(new URL('/api/auth/me', req.url), {
      headers: { cookie: req.headers.get('cookie') || '' },
    });
    if (r.status === 401) {
      return NextResponse.redirect(new URL('/login', req.url), { status: 307 });
    }
    return NextResponse.next();
  }

  const needsAuth =
    p.startsWith('/dashboard') ||
    p.startsWith('/messages') ||
    p.startsWith('/applications') ||
    p.startsWith('/settings');

  if (!needsAuth) return NextResponse.next();

  const hasSession = Boolean(req.cookies.get(env.JWT_COOKIE_NAME!)?.value);
  if (hasSession) return NextResponse.next();

  const url = new URL('/login', req.url);
  url.searchParams.set('next', req.nextUrl.pathname + req.nextUrl.search);
  return NextResponse.redirect(url, { status: 307 });
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/messages/:path*',
    '/applications/:path*',
    '/settings/:path*',
    '/account/:path*',
    '/dashboard',
    '/messages',
    '/applications',
    '/settings',
    '/account',
  ],
};

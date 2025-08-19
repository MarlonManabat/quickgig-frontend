import { NextResponse, type NextRequest } from 'next/server';
import { env } from '@/config/env';

export function middleware(req: NextRequest) {
  const p = req.nextUrl.pathname;
  if (p.startsWith('/api') || p.startsWith('/socket.io')) return NextResponse.next();

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
    '/dashboard',
    '/messages',
    '/applications',
    '/settings',
  ],
};

import { NextResponse, type NextRequest } from 'next/server';
import { env } from '@/config/env';

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/api') || req.nextUrl.pathname === '/login') {
    return NextResponse.next();
  }
  const token = req.cookies.get(env.JWT_COOKIE_NAME);
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', req.nextUrl.pathname + req.nextUrl.search);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/messages/:path*', '/applications/:path*', '/settings/:path*'],
};

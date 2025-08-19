import { NextResponse, type NextRequest } from 'next/server';
import { env } from '@/config/env';

export function middleware(req: NextRequest) {
  const token = req.cookies.get(env.cookieName)?.value;
  if (!token) {
    const url = new URL('/login', req.url);
    url.searchParams.set('next', req.nextUrl.pathname + req.nextUrl.search);
    return NextResponse.redirect(url, { status: 307 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/messages/:path*', '/applications/:path*', '/settings/:path*'],
};

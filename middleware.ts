import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { env } from './src/config/env';

const protectedPaths = ['/dashboard', '/profile', '/account', '/applications'];
const employerPaths = ['/employer'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(env.JWT_COOKIE_NAME)?.value;

  if (protectedPaths.some((p) => pathname.startsWith(p))) {
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }

  if (employerPaths.some((p) => pathname.startsWith(p))) {
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
    const isEmployer = req.cookies.get('isEmployer')?.value === 'true';
    if (!isEmployer) {
      const url = req.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/account/:path*',
    '/employer/:path*',
  ],
};

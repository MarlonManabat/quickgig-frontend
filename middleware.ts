import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { env } from './src/config/env';

const protectedPaths = ['/dashboard', '/profile', '/account'];

export function middleware(req: NextRequest) {
  if (protectedPaths.some((p) => req.nextUrl.pathname.startsWith(p))) {
    const token = req.cookies.get(env.JWT_COOKIE_NAME)?.value;
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/account/:path*'],
};

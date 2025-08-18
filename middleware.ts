import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { env } from './src/config/env';
import { rateLimit } from './src/middleware/rateLimit';

const protectedPaths = ['/dashboard', '/settings/profile', '/settings/account'];
const employerPaths = ['/employer'];
const adminPaths = ['/admin'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(env.JWT_COOKIE_NAME)?.value;

  if (
    env.NEXT_PUBLIC_ENABLE_SECURITY_AUDIT &&
    (pathname.startsWith('/api') || pathname.startsWith('/status/ping'))
  ) {
    const limited = rateLimit(req);
    if (limited) return limited;
  }

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

  if (adminPaths.some((p) => pathname.startsWith(p))) {
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
    const role = req.cookies.get('role')?.value || '';
    const email = req.cookies.get('email')?.value || '';
    const isAdmin =
      ['admin', 'moderator', 'staff'].includes(role.toLowerCase()) ||
      (email && env.ADMIN_EMAILS.includes(email));
    if (!isAdmin) {
      const url = req.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*',
    '/status/ping',
    '/dashboard/:path*',
    '/settings/profile/:path*',
    '/settings/account/:path*',
    '/employer/:path*',
    '/admin/:path*',
  ],
};

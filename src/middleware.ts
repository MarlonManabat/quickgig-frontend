import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJwt } from '@/lib/jwt';

const PROTECTED = ['/dashboard', '/messages', '/payment', '/settings', '/profile'];

export function middleware(req: NextRequest) {
  const url = new URL(req.url);
  if (!PROTECTED.some((p) => url.pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const token = req.cookies.get(process.env.JWT_COOKIE_NAME || 'auth_token')?.value;
  const ok = token && verifyJwt(token, process.env.AUTH_SECRET || '');
  if (ok) return NextResponse.next();

  const next = encodeURIComponent(url.pathname + url.search);
  return NextResponse.redirect(new URL(`/login?next=${next}`, req.url));
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/messages/:path*',
    '/payment/:path*',
    '/settings/:path*',
    '/profile/:path*',
  ],
};


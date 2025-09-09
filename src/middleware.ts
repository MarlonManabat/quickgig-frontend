import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { isSmoke } from './lib/smoke';

export const config = {
  matcher: [
    '/((?!_next/|api/|_smoke/|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:js|css|png|jpg|jpeg|gif|svg|webp|ico)).*)',
  ],
};

const MAP: Record<string, string> = {
  '/browse-jobs': '/smoke/browse-jobs',
  '/post-jobs': '/smoke/post-job',
  '/applications': '/smoke/applications',
  '/tickets': '/smoke/tickets',
};

const PUBLIC = new Set([
  '/',
  '/browse-jobs',
  '/login',
  '/signup',
  '/logout',
  '/post-jobs',
  '/api/auth/pkce/start',
  '/api/auth/pkce/callback',
]);

export function middleware(req: NextRequest) {
  const url = new URL(req.url);
  if (PUBLIC.has(url.pathname)) return NextResponse.next();

  if (!isSmoke) return NextResponse.next();

  const dest = MAP[url.pathname];
  if (dest) {
    const to = new URL(dest, url.origin);
    return NextResponse.rewrite(to);
  }
  return NextResponse.next();
}

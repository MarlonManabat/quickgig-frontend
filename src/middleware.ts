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
  '/post-job': '/smoke/post-job',
  '/applications': '/smoke/applications',
  '/tickets': '/smoke/tickets',
};

export function middleware(req: NextRequest) {
  if (!isSmoke) return NextResponse.next();

  const url = new URL(req.url);
  const dest = MAP[url.pathname];
  if (dest) {
    const to = new URL(dest, url.origin);
    return NextResponse.rewrite(to);
  }
  return NextResponse.next();
}

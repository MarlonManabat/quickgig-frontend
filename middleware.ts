import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { LEGACY_REDIRECTS } from '@/app/lib/legacy-redirects';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1) Let smoke pages through untouched
  if (pathname.startsWith('/smoke') || pathname.startsWith('/__smoke__')) {
    return NextResponse.next();
  }

  // 2) Legacy redirects from landing
  const target = LEGACY_REDIRECTS[pathname as keyof typeof LEGACY_REDIRECTS];
  if (target) {
    const url = new URL(target, req.nextUrl);
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|static|favicon.ico|robots.txt|sitemap.xml).*)'],
};

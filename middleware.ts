import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const { pathname } = url;
  // Normalize legacy paths everywhere (belt-and-suspenders)
  if (pathname === '/post-job') { url.pathname = '/gigs/create'; return NextResponse.redirect(url, 308); }
  if (pathname === '/find') { url.pathname = '/browse-jobs'; return NextResponse.redirect(url, 308); }
  if (pathname === '/my-applications') { url.pathname = '/applications'; return NextResponse.redirect(url, 308); }
  if (pathname === '/applications/login') {
    url.pathname = '/login'; url.searchParams.set('next', '/applications'); return NextResponse.redirect(url, 302);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

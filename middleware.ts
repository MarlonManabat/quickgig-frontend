import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const host = req.headers.get('host') ?? '';
  const isApp = host.startsWith('app.');
  const { pathname } = url;

  if (!isApp && pathname === '/') {
    url.pathname = '/landing';
    return NextResponse.rewrite(url);
  }

  if (isApp && pathname === '/landing') {
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/landing'],
};

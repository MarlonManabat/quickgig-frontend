import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ALLOWED_HOSTS = ['app.quickgig.ph', 'quickgig.ph'];

export function middleware(req: NextRequest) {
  if (process.env.VERCEL_ENV !== 'production') {
    return NextResponse.next();
  }

  const url = req.nextUrl;
  const host = req.headers.get('host') ?? '';

  if (!ALLOWED_HOSTS.includes(host)) {
    return new NextResponse(null, { status: 404 });
  }

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

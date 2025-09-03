import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ALLOWED_HOSTS = ['app.quickgig.ph', 'quickgig.ph'];

export function middleware(req: NextRequest) {
  const { pathname, host } = req.nextUrl;

  // Always allow preview and root to pass through
  if (pathname === '/' || host.endsWith('.vercel.app')) {
    return NextResponse.next();
  }

  if (process.env.VERCEL_ENV !== 'production') {
    return NextResponse.next();
  }

  const url = req.nextUrl;
  const reqHost = req.headers.get('host') ?? '';

  if (!ALLOWED_HOSTS.includes(reqHost)) {
    return new NextResponse(null, { status: 404 });
  }

  const isApp = reqHost.startsWith('app.');

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

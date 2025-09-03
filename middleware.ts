import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Canonical host for production deploys of the app
const PROD_HOSTS = new Set(['app.quickgig.ph']);

// Internal assets/endpoints always allowed
const isInternal = (p: string) =>
  p.startsWith('/_next') || p === '/favicon.ico' || p.startsWith('/api/health');

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const host = req.headers.get('host') ?? '';

  // In preview/dev (e.g. *.vercel.app), allow everything
  if (process.env.VERCEL_ENV !== 'production') {
    return NextResponse.next();
  }

  // In production, only serve from the canonical app host
  if (!PROD_HOSTS.has(host)) {
    return new NextResponse(null, { status: 404 });
  }

  // Always allow framework/static and health checks
  if (isInternal(pathname)) {
    return NextResponse.next();
  }

  // No rewrites here; "/" redirect is handled in src/app/page.tsx
  return NextResponse.next();
}

// Exclude static/image assets from middleware
export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
};

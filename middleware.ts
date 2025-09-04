import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const APP_ORIGIN = process.env.NEXT_PUBLIC_APP_ORIGIN ?? 'https://app.quickgig.ph';

// Static/infra paths that must pass
const passthrough = (p: string) =>
  p.startsWith('/_next') || p.startsWith('/favicon') || /\.\w+$/.test(p);

// Only redirect these app paths. Keep '/' as landing homepage.
const APP_PATHS = new Set<string>([
  '/browse-jobs',
  '/gigs/create',
  '/applications',
  '/login',
  '/sign-in',
]);

// Legacy paths from old landing; map to canonical app routes
const LEGACY_PATHS = new Map<string, string>([
  ['/find', '/browse-jobs'],
  ['/gigs', '/browse-jobs'],
  ['/browsejobs', '/browse-jobs'],
  ['/post-job', '/gigs/create'],
  ['/my-apps', '/applications'],
]);

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  if (passthrough(pathname)) return NextResponse.next();

  // Bypass for smoke test pages
  if (pathname.startsWith('/smoke') || pathname.startsWith('/__smoke__')) {
    return NextResponse.next();
  }

  const target = LEGACY_PATHS.get(pathname) || (APP_PATHS.has(pathname) ? pathname : null);
  if (target) {
    const url = new URL(target + search, APP_ORIGIN);
    return NextResponse.redirect(url, 308);
  }
  return NextResponse.next();
}

// Apply to everything except static files for perf
export const config = { matcher: ['/((?!_next/|.*\\..*).*)'] };

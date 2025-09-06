import { NextRequest, NextResponse } from 'next/server';

const inSmoke = process.env.MOCK_MODE === '1' || process.env.CI === 'true';

// exact-path rewrites only; avoids double path bugs
const SMOKE_REWRITES: Record<string, string> = {
  '/': '/_smoke/browse-jobs',
  '/browse-jobs': '/_smoke/browse-jobs',
  '/applications': '/_smoke/applications',
  '/post-job': '/_smoke/post-job',
  '/tickets/topup': '/_smoke/tickets-topup',
  '/login': '/_smoke/login',
};

export function middleware(req: NextRequest) {
  if (inSmoke) {
    const dest = SMOKE_REWRITES[req.nextUrl.pathname as keyof typeof SMOKE_REWRITES];
    if (dest) {
      const url = req.nextUrl.clone();
      url.pathname = dest; // no join => no double paths
      return NextResponse.rewrite(url);
    }
  }

  // legacy redirect for root
  if (req.nextUrl.pathname === '/' || req.nextUrl.pathname === '/index.html') {
    return NextResponse.redirect(new URL('/browse-jobs', req.url), 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/browse-jobs', '/applications', '/post-job', '/tickets/topup', '/login'],
};

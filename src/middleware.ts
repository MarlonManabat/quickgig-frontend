import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { isSmoke } from './lib/smoke';

const AUTH_COOKIES = [
  'sb-access-token',
  'sb:token',
  'next-auth.session-token',
  'qg_session',
  'supabase-auth-token',
];

function hasSession(req: NextRequest) {
  for (const k of AUTH_COOKIES) if (req.cookies.has(k)) return true;
  return false;
}

export const config = {
  matcher: [
    '/((?!_next/|api/|_smoke/|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:js|css|png|jpg|jpeg|gif|svg|webp|ico)).*)',
  ],
};

const MAP: Record<string, string> = {
  '/browse-jobs': '/smoke/browse-jobs',
  '/applications': '/smoke/applications',
  '/tickets': '/smoke/tickets',
};

const PUBLIC = new Set([
  '/',
  '/browse-jobs',
  '/login',
  '/signup',
  '/logout',
  '/post-job',
  '/api/auth/pkce/start',
  '/api/auth/pkce/callback',
]);

export function middleware(req: NextRequest) {
  const url = new URL(req.url);
  const path = url.pathname;

  // Auth-gate Applications route for guests
  if (path.startsWith('/applications')) {
    if (!hasSession(req)) {
      const next = encodeURIComponent(path + (url.search || ''));
      const loginUrl = url.clone();
      loginUrl.pathname = '/login';
      loginUrl.search = `?next=${next}`;
      return NextResponse.redirect(loginUrl);
    }
  }

  if (PUBLIC.has(path)) return NextResponse.next();

  if (!isSmoke) return NextResponse.next();

  const dest = MAP[path];
  if (dest) {
    const to = new URL(dest, url.origin);
    return NextResponse.rewrite(to);
  }
  return NextResponse.next();
}

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Gate ONLY /applications to /login when unauthenticated (qg_auth=1 not present).
export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  if (!pathname.startsWith('/applications')) return NextResponse.next();

  const authed = req.cookies.get('qg_auth')?.value === '1';
  if (authed) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = '/login';
  url.search = `?next=${encodeURIComponent(pathname + (search || ''))}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/applications/:path*'],
};

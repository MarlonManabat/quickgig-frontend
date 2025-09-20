import { NextResponse, type NextRequest } from 'next/server';

const AUTH_COOKIE = 'qg_auth';

function buildLoginRedirect(request: NextRequest) {
  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = '/login';
  loginUrl.searchParams.set('next', request.nextUrl.pathname + request.nextUrl.search);
  return NextResponse.redirect(loginUrl);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/applications') || pathname.startsWith('/my-applications')) {
    if (!request.cookies.get(AUTH_COOKIE)) {
      return buildLoginRedirect(request);
    }
  }

  if (['/post', '/posts', '/gigs/new'].includes(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = '/gigs/create';
    url.searchParams.delete('next');
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/applications/:path*', '/my-applications/:path*', '/post', '/posts', '/gigs/new'],
};

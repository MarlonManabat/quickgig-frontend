import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const protectedPaths = ['/my-applications', '/post-job', '/profile'];
  const isProtected = protectedPaths.some(path => req.nextUrl.pathname.startsWith(path));

  if (isProtected && !session) {
    // Redirect to login page with 'next' parameter
    const loginUrl = new URL('/login', req.nextUrl.origin);
    loginUrl.searchParams.set('next', req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/auth (auth API routes)
     * - api/mock (mock API routes)
     * - api/test (test API routes)
     * - /
     * - /login
     * - /browse-jobs
     */
    '/((?!_next/static|_next/image|favicon.ico|api/auth|api/mock|api/test|login|browse-jobs|[^/]+\\.[^/]+).*)',
  ],
};


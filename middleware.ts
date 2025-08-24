import { NextResponse, type NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/auth') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/robots') ||
    pathname.startsWith('/sitemap')
  ) {
    return NextResponse.next();
  }

  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return res;

  const { data: profile } = await supabase
    .from('profiles')
    .select('role_pref')
    .eq('id', user.id)
    .maybeSingle();

  const role = profile?.role_pref as 'worker' | 'employer' | null;

  if (!role) {
    if (pathname.startsWith('/dashboard/')) {
      const url = req.nextUrl.clone();
      url.pathname = '/home';
      return NextResponse.redirect(url);
    }
    return res;
  }

  if (pathname === '/home') {
    const url = req.nextUrl.clone();
    url.pathname = role === 'worker' ? '/dashboard/worker' : '/dashboard/employer';
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith('/dashboard/')) {
    const desired = role === 'worker' ? '/dashboard/worker' : '/dashboard/employer';
    if (pathname !== desired) {
      const url = req.nextUrl.clone();
      url.pathname = desired;
      return NextResponse.redirect(url);
    }
  }

  return res;
}

export const config = {
  matcher: ['/((?!.*\\.).*)'],
};

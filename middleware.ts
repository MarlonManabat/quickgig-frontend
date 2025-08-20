import { NextResponse, type NextRequest } from 'next/server';
export async function middleware(req: NextRequest) {
  const p = req.nextUrl.pathname;
  if (p.startsWith('/api') || p.startsWith('/_next')) return NextResponse.next();
  if (p.startsWith('/account')) {
    const r = await fetch(new URL('/api/auth/me', req.url), {
      headers: { cookie: req.headers.get('cookie') ?? '' },
      cache: 'no-store',
    });
    if (r.status === 401)
      return NextResponse.redirect(new URL('/login', req.url), { status: 307 });
  }
  return NextResponse.next();
}
export const config = { matcher: ['/account'] };

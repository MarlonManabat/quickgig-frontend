import { NextResponse, type NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.next(); // guard for CI/preview env drift

  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res }, { supabaseUrl: url, supabaseKey: key });
  await supabase.auth.getSession().catch(() => {});
  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|api/).*)'],
};

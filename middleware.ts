import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createMiddlewareClient({ req, res }, {
    cookieOptions: {
      // Allows shared auth across app.quickgig.ph and quickgig.ph
      domain: process.env.SUPABASE_AUTH_COOKIE_DOMAIN || undefined
    }
  });

  // Triggers a refresh if the session is expired/expiring
  await supabase.auth.getSession();

  return res;
}

// Exclude static assets and health endpoints
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|api/health).*)'
  ]
};

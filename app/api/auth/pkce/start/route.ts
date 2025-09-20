import { NextResponse } from 'next/server';

import { getOrigin, sanitizeNext } from '@/lib/auth-responses';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const next = sanitizeNext(url.searchParams.get('next'));
  const origin = getOrigin(request) || process.env.NEXT_PUBLIC_APP_ORIGIN || 'http://localhost:3000';
  const redirectUrl = new URL('/login', origin);
  redirectUrl.searchParams.set('next', next);
  return NextResponse.redirect(redirectUrl);
}

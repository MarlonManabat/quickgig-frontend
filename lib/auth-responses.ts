import { NextResponse } from 'next/server';

import type { Session } from '@/lib/auth';

const AUTH_COOKIE = 'qg_auth';

function resolveRedirect(request: Request, next: string) {
  const origin = request.headers.get('origin') ?? process.env.NEXT_PUBLIC_APP_ORIGIN ?? 'http://localhost:3000';
  return new URL(next, origin);
}

export function buildLoginResponse(request: Request, session: Session, next: string) {
  const redirectUrl = resolveRedirect(request, next);
  const response = NextResponse.redirect(redirectUrl);
  response.cookies.set(AUTH_COOKIE, JSON.stringify(session), {
    path: '/',
    httpOnly: false,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24,
  });
  return response;
}

export function buildLogoutResponse(request: Request, next: string) {
  const redirectUrl = resolveRedirect(request, next);
  const response = NextResponse.redirect(redirectUrl);
  response.cookies.set(AUTH_COOKIE, '', {
    path: '/',
    httpOnly: false,
    expires: new Date(0),
  });
  return response;
}

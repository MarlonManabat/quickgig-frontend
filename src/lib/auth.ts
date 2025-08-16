import { NextResponse } from 'next/server';
import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import { env } from '@/config/env';

export function getSessionFromCookies(cookies: Pick<ReadonlyRequestCookies, 'get'>) {
  const token = cookies.get(env.JWT_COOKIE_NAME)?.value;
  if (!token) return { user: null };
  // Stub user until real validation is added
  const user = { id: '1', email: 'user@example.com', name: 'Test User' };
  return { user };
}

export function setAuthCookie(res: NextResponse, token: string) {
  res.cookies.set(env.JWT_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
}

export function clearAuthCookie(res: NextResponse) {
  res.cookies.set(env.JWT_COOKIE_NAME, '', {
    httpOnly: true,
    expires: new Date(0),
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  });
}

import 'server-only';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const AUTH_COOKIE = 'qg_auth';

export type Session = {
  userId: string;
  role: 'worker' | 'employer';
  email?: string;
};

export function parseSessionCookie(value: string | undefined): Session | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value);
    if (typeof parsed.userId === 'string' && (parsed.role === 'worker' || parsed.role === 'employer')) {
      return parsed;
    }
  } catch (error) {
    console.warn('Invalid auth cookie', error);
  }
  return null;
}

export function getSession(): Session | null {
  const cookie = cookies().get(AUTH_COOKIE)?.value;
  return parseSessionCookie(cookie);
}

export function requireSession(next: string): Session {
  const session = getSession();
  if (!session) {
    redirect(`/login?next=${encodeURIComponent(next)}`);
  }
  return session;
}

export function clearSessionCookie() {
  cookies().delete(AUTH_COOKIE);
}

export function createSessionCookie(session: Session) {
  cookies().set(AUTH_COOKIE, JSON.stringify(session), {
    httpOnly: false,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24,
  });
}

export function getAuthAwareHref(path: string, session: Session | null, origin?: string) {
  if (session) {
    return path;
  }
  if (!origin) {
    return `/login?next=${encodeURIComponent(path)}`;
  }
  const loginUrl = new URL('/login', origin);
  loginUrl.searchParams.set('next', path);
  return loginUrl.toString();
}

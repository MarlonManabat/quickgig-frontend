import type { NextRequest } from 'next/server';
import { AUTH_COOKIE } from '@/lib/constants';

type CookieJar = { get(name: string): { value?: string } | undefined };

export function hasAuthCookies(jar: CookieJar): boolean {
  const value = jar.get(AUTH_COOKIE)?.value;
  return typeof value === 'string' && value.length > 0;
}

export function hasAuthCookieHeader(cookieHeader: string | null | undefined): boolean {
  if (!cookieHeader) return false;
  return new RegExp(`(?:^|;\\s*)${AUTH_COOKIE}=`).test(cookieHeader);
}

export function isAuthedRequest(req: NextRequest): boolean {
  return hasAuthCookieHeader(req.headers.get('cookie'));
}

export function cookieDomainFor(hostname: string): string | undefined {
  const parts = hostname.split('.').filter(Boolean);
  if (parts.length >= 2) {
    return `.${parts.slice(-2).join('.')}`;
  }
  return undefined;
}

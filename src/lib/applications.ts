import { cookies, headers } from 'next/headers';
import { cookieDomainFor } from '@/lib/auth/cookies';

export const APPLICATIONS_COOKIE = 'gg_apps';

export function readAppliedIdsFromCookie(): string[] {
  const raw = cookies().get(APPLICATIONS_COOKIE)?.value;
  if (!raw) return [];
  try {
    const val = JSON.parse(raw);
    if (Array.isArray(val)) {
      return [...new Set(val.map((v) => String(v)))].slice(0, 100);
    }
  } catch {}
  return [];
}

// Helper for API routes to set the applications cookie consistently
export function cookieOptionsForHost() {
  const host = headers().get('host') || '';
  const domain = cookieDomainFor(host.split(':')[0] ?? '');
  return {
    httpOnly: true as const,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 90, // 90 days
    ...(domain ? { domain } : {}),
  };
}


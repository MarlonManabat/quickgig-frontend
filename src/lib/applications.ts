import { cookies, headers } from 'next/headers';
import { cookieDomainFor } from '@/lib/auth/cookies';

export const APPLICATIONS_COOKIE = 'gg_apps';

export type ApplicationEntry = { id: string; ts: number };

type RawEntry = { id?: unknown; ts?: unknown };

function parse(raw: string | undefined): ApplicationEntry[] {
  if (!raw) return [];
  try {
    const val = JSON.parse(raw);
    if (Array.isArray(val)) {
      if (val.length && typeof val[0] !== 'object') {
        const now = Date.now();
        return [...new Set(val.map((v: unknown) => String(v)))].map((id) => ({ id, ts: now }));
      }
      return val
        .map((entry: RawEntry) => {
          if (!entry || entry.id == null) return null;
          return { id: String(entry.id), ts: Number(entry.ts) || Date.now() } satisfies ApplicationEntry;
        })
        .filter((entry): entry is ApplicationEntry => Boolean(entry));
    }
  } catch {}
  return [];
}

export function readApplications(): ApplicationEntry[] {
  const raw = cookies().get(APPLICATIONS_COOKIE)?.value;
  return parse(raw).slice(0, 100);
}

export function readAppliedIdsFromCookie(): string[] {
  return readApplications().map((entry) => entry.id);
}

export function hasApplied(id: string | number): boolean {
  const target = String(id);
  return readApplications().some((entry) => entry.id === target);
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

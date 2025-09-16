import { cookies } from 'next/headers';
import { NEXT_COOKIE } from '@/lib/constants';

export function readCookie(name: string): string | null {
  try {
    return cookies().get(name)?.value ?? null;
  } catch {
    return null;
  }
}

// Allow only same-origin absolute-path redirects
export function safePath(p: string | null | undefined): string | null {
  if (!p) return null;
  try {
    const decoded = decodeURIComponent(p);
    if (decoded.startsWith('/')) return decoded;
    return null;
  } catch {
    return p.startsWith('/') ? p : null;
  }
}

export function clearAuthCookies(opts?: { also?: string[] }) {
  const jar = cookies();
  ['sb-access-token', 'sb-refresh-token', NEXT_COOKIE, ...(opts?.also ?? [])].forEach((n) => {
    try {
      // @ts-ignore – cookie typings differ across Next versions
      jar.delete(n);
    } catch {}
  });
}

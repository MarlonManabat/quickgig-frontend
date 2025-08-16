import { cookies, headers } from 'next/headers';

export function cookieDomainForHost(host: string | undefined) {
  if (!host) return undefined;
  // Use apex domain when under *.vercel.app previews; otherwise let the browser decide
  if (host.endsWith('.vercel.app')) return undefined;
  if (host.split('.').length >= 3) return '.' + host.split('.').slice(-2).join('.');
  return undefined;
}

export function setSessionCookie(name: string, value: string, expTsSec: number) {
  const h = headers();
  const host = h.get('x-forwarded-host') || h.get('host') || undefined;
  const domain = cookieDomainForHost(host);
  cookies().set({
    name,
    value,
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    path: '/',
    expires: new Date(expTsSec * 1000),
    ...(domain ? { domain } : {}),
  });
}

export function clearSessionCookie(name: string) {
  const h = headers();
  const host = h.get('x-forwarded-host') || h.get('host') || undefined;
  const domain = cookieDomainForHost(host);
  cookies().set({
    name,
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    path: '/',
    expires: new Date(0),
    ...(domain ? { domain } : {}),
  });
}


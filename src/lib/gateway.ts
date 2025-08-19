import { env } from '@/config/env';
import { headers as nextHeaders } from 'next/headers';

export function copySetCookie(from: Response, to: Headers) {
  const raw = (from.headers as unknown as { getSetCookie?: () => string[] }).getSetCookie?.();
  const cookies = raw ?? (from.headers.get('set-cookie') ? [from.headers.get('set-cookie') as string] : []);
  for (const c of cookies) {
    to.append('set-cookie', c);
  }
}

export async function gateway(
  path: string,
  init: RequestInit & { cookies?: string[] } = {}
) {
  const { cookies, headers, ...rest } = init;
  const h = new Headers(headers);
  h.set('content-type', 'application/json');

  const incoming = cookies ? cookies.join('; ') : nextHeaders().get('cookie');
  if (incoming) {
    h.set('cookie', incoming);
  }

  return fetch(`${env.API_URL!}${path}`, { ...rest, headers: h });
}

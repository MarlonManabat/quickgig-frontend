import { headers } from 'next/headers';

export function getOrigin(req?: Request) {
  const h = req ? req.headers : headers();
  const proto = h.get('x-forwarded-proto') ?? 'http';
  const host = h.get('host');
  if (host) return `${proto}://${host}`;
  return process.env.NEXT_PUBLIC_APP_ORIGIN || '';
}

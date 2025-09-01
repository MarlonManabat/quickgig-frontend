import { headers } from 'next/headers';

export function getOrigin() {
  const h = headers();
  const host = h.get('x-forwarded-host') || h.get('host');
  const proto = h.get('x-forwarded-proto') || 'https';
  if (host) return `${proto}://${host}`;
  return process.env.NEXT_PUBLIC_APP_ORIGIN || 'http://localhost:3000';
}

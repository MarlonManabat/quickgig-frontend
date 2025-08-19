import { NextResponse } from 'next/server';
import { env } from '@/config/env';
import { gateway, copySetCookie } from '@/lib/gateway';

export const runtime = 'nodejs';

export async function POST() {
  if (!env.API_URL) {
    return Response.json(
      { ok: false, error: 'misconfigured', detail: 'API_URL is not set' },
      { status: 503 }
    );
  }

  let upstream: Response | null = null;
  try {
    upstream = await gateway('/auth/logout', { method: 'POST' });
  } catch {
    upstream = null;
  }
  const res = new NextResponse(null, { status: 204 });
  if (upstream) {
    copySetCookie(upstream, res.headers);
  }
  res.cookies.set({
    name: env.JWT_COOKIE_NAME!,
    value: '',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return res;
}

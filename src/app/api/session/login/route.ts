import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { env } from '@/config/env';
import { gateway, copySetCookie } from '@/lib/gateway';

export const runtime = 'nodejs';

const BodySchema = z.object({ identifier: z.string(), password: z.string() });

export async function POST(req: NextRequest) {
  if (!env.API_URL) {
    return Response.json(
      { ok: false, error: 'misconfigured', detail: 'API_URL is not set' },
      { status: 503 }
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'Invalid body' }, { status: 400 });
  }

  const upstream = await gateway('/auth/login', {
    method: 'POST',
    body: JSON.stringify(parsed.data),
  });

  if (upstream.ok) {
    const res = new NextResponse(null, { status: 204 });
    copySetCookie(upstream, res.headers);
    if (!upstream.headers.get('set-cookie')) {
      const data = await upstream.json().catch(() => null);
      const token = data?.token || data?.accessToken;
      if (token) {
        res.cookies.set({
          name: env.JWT_COOKIE_NAME!,
          value: token,
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
          path: '/',
          maxAge: Number(env.JWT_MAX_AGE_SECONDS),
        });
      }
    }
    return res;
  }

  const headers = new Headers();
  copySetCookie(upstream, headers);
  const data = await upstream.json().catch(() => null);
  const error = data?.error || data?.message || 'Login failed';
  return NextResponse.json({ ok: false, error }, { status: upstream.status, headers });
}

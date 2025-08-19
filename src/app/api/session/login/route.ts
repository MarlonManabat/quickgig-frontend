import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { env } from '@/config/env';
import { gateway } from '@/lib/gateway';
import { copySetCookie } from '@/lib/http';

export const runtime = 'nodejs';

const BodySchema = z.object({ identifier: z.string(), password: z.string() });

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'Invalid body' }, { status: 400 });
  }

  const upstream = await gateway('/auth/login', {
    method: 'POST',
    body: JSON.stringify(parsed.data),
    cache: 'no-store',
  });
  const cookieInit = copySetCookie(upstream);
  if (upstream.ok) {
    const res = new NextResponse(null, { ...cookieInit, status: 204 });
    if (!upstream.headers.get('set-cookie')) {
      const data = await upstream.json().catch(() => null);
      const token = data?.token || data?.accessToken;
      if (token) {
        res.cookies.set({
          name: env.JWT_COOKIE_NAME,
          value: token,
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
          path: '/',
          maxAge: env.JWT_MAX_AGE_SECONDS,
        });
      }
    }
    return res;
  }

  const text = await upstream.text();
  const sanitized = parsed.data.password
    ? text.replaceAll(parsed.data.password, '')
    : text;
  console.error('[login]', upstream.status, sanitized.slice(0, 100));
  return NextResponse.json(
    { ok: false, error: sanitized, status: upstream.status },
    { ...cookieInit, status: upstream.status },
  );
}

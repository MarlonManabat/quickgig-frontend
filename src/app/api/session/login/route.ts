import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { env, isProd } from '@/config/env';
import { gateFetch } from '@/lib/gateway';

export const runtime = 'nodejs';

const BodySchema = z.object({ identifier: z.string(), password: z.string() });

export async function POST(req: NextRequest) {
  const parsed = BodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'Invalid body' }, { status: 400 });
  }
  const upstream = await gateFetch('/auth/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(parsed.data),
  });

  if (upstream.ok) {
    let token: string | undefined;
    const setCookie = upstream.headers.get('set-cookie');
    if (setCookie) {
      const match = setCookie.match(new RegExp(`${env.JWT_COOKIE_NAME}=([^;]+)`));
      if (match) token = match[1];
    }
    if (!token) {
      const data = await upstream.json().catch(() => null);
      token = data?.token;
    }
    if (!token) {
      return NextResponse.json({ ok: false, error: 'Missing token' }, { status: 500 });
    }
    const res = NextResponse.json({ ok: true });
    res.cookies.set({
      name: env.JWT_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: env.JWT_MAX_AGE_SECONDS,
      ...(isProd ? { domain: 'quickgig.ph' } : {}),
    });
    return res;
  }

  const errorData = await upstream.json().catch(() => null);
  const error = (errorData && (errorData.error || errorData.message)) || upstream.statusText;
  return NextResponse.json({ ok: false, error }, { status: upstream.status });
}

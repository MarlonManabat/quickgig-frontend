import { NextRequest, NextResponse } from 'next/server';
import { env, isProd } from '@/config/env';
import { gateFetch } from '@/lib/gateway';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const token = req.cookies.get(env.cookieName)?.value;
  if (token) {
    await gateFetch('/auth/logout', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Cookie: `${env.cookieName}=${token}`,
      },
    }).catch(() => undefined);
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: env.cookieName,
    value: '',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
    ...(isProd ? { domain: 'quickgig.ph' } : {}),
  });
  return res;
}

import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/config/env';
import { gateFetch } from '@/lib/gateway';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const token = req.cookies.get(env.cookieName)?.value;
  if (!token) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const upstream = await gateFetch('/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`,
      Cookie: `${env.cookieName}=${token}`,
    },
  });
  if (upstream.status === 200) {
    const data = await upstream.json().catch(() => ({}));
    return NextResponse.json(data);
  }
  return NextResponse.json({ ok: false }, { status: 401 });
}

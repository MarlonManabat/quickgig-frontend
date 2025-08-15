import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { env } from '@/config/env';
import { API } from '@/config/api';
import { proxyFetch } from '@/server/proxy';

export async function GET() {
  try {
    const token = cookies().get(env.JWT_COOKIE_NAME)?.value;
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    const { res, data } = await proxyFetch(API.me, { method: 'GET', headers });
    return NextResponse.json(
      typeof data === 'object' && data
        ? { ok: res.ok, ...(data as object) }
        : { ok: res.ok },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 200 });
}

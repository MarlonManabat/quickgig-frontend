import { NextResponse } from 'next/server';
import { env } from '@/config/env';
import { API } from '@/config/api';
import { parseSafe } from '@/server/proxy';

export async function GET(req: Request) {
  console.info('GET /api/session/me');
  try {
    const res = await fetch(`${env.API_URL}${API.me}`, {
      method: 'GET',
      headers: { cookie: req.headers.get('cookie') || '' },
      credentials: 'include',
    });
    const data = await parseSafe(res);
    if (res.ok) {
      const user =
        typeof data === 'object' && data
          ? (data as Record<string, unknown>)['user'] ?? data
          : undefined;
      console.info('GET /api/session/me', res.status);
      return NextResponse.json(
        { ok: true, user },
        { status: res.status },
      );
    }
    console.info('GET /api/session/me', res.status);
    return NextResponse.json({ ok: false }, { status: res.status });
  } catch (err) {
    console.info('GET /api/session/me error', err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 200 });
}


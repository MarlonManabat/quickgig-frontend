import { NextResponse } from 'next/server';
import { env } from '@/config/env';
import { gate, passThroughSetCookie } from '@/config/api';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const upstream = await fetch(gate(env.GATE_LOGIN_PATH), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email, password }),
    redirect: 'manual',
    credentials: 'include',
    cache: 'no-store',
  });

  if (upstream.status === 200 || upstream.status === 302) {
    const res = new NextResponse(upstream.body, {
      status: upstream.status,
      headers: {
        'content-type': upstream.headers.get('content-type') || 'application/json',
        'cache-control': 'no-store',
      },
    });
    passThroughSetCookie(upstream, res.headers);
    return res;
  }

  if (upstream.status === 401) {
    return NextResponse.json(
      { ok: false, error: 'Invalid credentials' },
      { status: 401, headers: { 'cache-control': 'no-store' } }
    );
  }

  const text = await upstream.text().catch(() => '');
  return NextResponse.json(
    { ok: false, error: text || upstream.statusText },
    { status: upstream.status, headers: { 'cache-control': 'no-store' } }
  );
}

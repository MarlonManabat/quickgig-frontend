import { NextResponse } from 'next/server';
import { env } from '@/config/env';
import { gate, passThroughSetCookie } from '@/config/api';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const upstream = await fetch(gate(env.GATE_LOGOUT_PATH), {
    method: 'POST',
    headers: { cookie: req.headers.get('cookie') || '' },
    credentials: 'include',
    cache: 'no-store',
  });
  const res = new NextResponse(null, {
    status: 204,
    headers: { 'cache-control': 'no-store' },
  });
  passThroughSetCookie(upstream, res.headers);
  return res;
}

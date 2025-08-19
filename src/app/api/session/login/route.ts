import { NextRequest, NextResponse } from 'next/server';
import { getEnv } from '@/config/env';
import { copySetCookie, jsonFrom } from '@/lib/proxy';

export async function POST(req: NextRequest) {
  const { API_URL } = getEnv();
  const body = await req.json().catch(() => ({}));

  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
    redirect: 'manual',
  });

  const out = NextResponse.json(await jsonFrom(res), { status: res.status });
  copySetCookie(res, out);
  return out;
}

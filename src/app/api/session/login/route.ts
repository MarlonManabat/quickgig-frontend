import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { env } from '@/config/env';
import { API } from '@/config/api';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const res = await fetch(`${env.API_URL}${API.login}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (res.ok && data.token) {
    const response = NextResponse.json({ ok: true });
    response.cookies.set(env.JWT_COOKIE_NAME, data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  }
  return NextResponse.json(data, { status: res.status });
}

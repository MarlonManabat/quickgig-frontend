import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { env } from '@/config/env';
import { API } from '@/config/api';

export async function GET(req: NextRequest) {
  const token = req.cookies.get(env.JWT_COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ ok: false }, { status: 401 });

  const headers: Record<string, string> = {
    Cookie: `${env.JWT_COOKIE_NAME}=${token}`,
  };
  headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${env.API_URL}${API.me}`, {
    headers,
    cache: 'no-store',
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

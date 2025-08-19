import { NextResponse } from 'next/server';
import { getEnv } from '@/config/env';
import { copySetCookie, jsonFrom, withCookieHeaders } from '@/lib/proxy';

export async function POST() {
  const { API_URL } = getEnv();
  const res = await fetch(`${API_URL}/auth/logout`, withCookieHeaders({
    method: 'POST',
    redirect: 'manual',
  }));
  const out = NextResponse.json(await jsonFrom(res), { status: res.status });
  copySetCookie(res, out); // allow backend to clear cookie
  return out;
}

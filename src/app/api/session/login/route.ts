/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { env } from '@/config/env';
import { API } from '@/config/api';

function jsonSafe<T = any>(r: Response): Promise<T | null> {
  return r.text().then(t => { try { return JSON.parse(t) } catch { return t ? (t as any) : null } });
}

export async function POST(req: Request) {
  const { email, password } = await req.json().catch(() => ({}));
  const url = `${env.API_URL}${API.login}`;
  const start = Date.now();

  try {
    // try JSON first
    let res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    // if backend doesn’t accept JSON, retry as form-encoded
    if (res.status === 415 || res.status === 400) {
      res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ email: String(email || ''), password: String(password || '') }),
      });
    }

    const data: any = await jsonSafe(res);
    const dur = Date.now() - start;
    console.log('[auth.login] →', { url, status: res.status, ok: res.ok, durMs: dur, preview: typeof data === 'string' ? data.slice(0,200) : (data && Object.keys(data).slice(0,6)) });

    const token = data?.token || data?.accessToken || data?.jwt || '';
    if (res.ok && token) {
      const resp = NextResponse.json({ ok: true });
      resp.headers.set('Set-Cookie',
        `${env.JWT_COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; ${process.env.NODE_ENV==='production'?'Secure; ':''}Max-Age=${60*60*24*30}`
      );
      return resp;
    }

    return NextResponse.json(
      { ok: false, message: (data && (data.message || data.error)) || 'Invalid email or password' },
      { status: 200 }
    );
  } catch (e: any) {
    console.error('[auth.login] EXCEPTION', { url, msg: e?.message });
    return NextResponse.json({ ok: false, message: 'Auth service unreachable' }, { status: 200 });
  }
}

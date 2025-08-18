import { NextResponse } from 'next/server';
import { env } from '@/config/env';
async function toJsonSafe(r: Response) {
  const t = await r.text();
  try { return JSON.parse(t); } catch { return t ? { raw: t } : {}; }
}

export async function POST(req: Request) {
  const { email, password } = await req.json().catch(() => ({}));
  const url = `${env.API_URL}/auth/login.php`;
  try {
    // Try JSON
    let r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    // If engine expects form-encoded
    if (!r.ok && (r.status === 400 || r.status === 415)) {
      r = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ email: String(email || ''), password: String(password || '') }),
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = await toJsonSafe(r);
    const token = data?.token || data?.accessToken || data?.jwt || data?.data?.token || '';

    if (r.ok && token) {
      const resp = NextResponse.json({ ok: true });
      resp.headers.set(
        'Set-Cookie',
        `${env.JWT_COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; ${
          process.env.NODE_ENV === 'production' ? 'Secure; ' : ''
        }Max-Age=${60 * 60 * 24 * 30}`
      );
      return resp;
    }

    return NextResponse.json(
      { ok: false, message: data?.message || data?.error || 'Invalid email or password' },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { ok: false, message: 'Auth service unreachable' },
      { status: 200 }
    );
  }
}

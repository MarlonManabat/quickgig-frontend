import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { signJwt } from '@/lib/jwt';
import { setSessionCookie } from '@/lib/cookies';

export const runtime = 'nodejs';

// simple in-memory token bucket keyed by IP
const buckets: Record<string, { tokens: number; last: number }> = {};
const MAX_TOKENS = 5;
const REFILL_MS = 60_000;

function takeToken(key: string) {
  const now = Date.now();
  const b = buckets[key] || { tokens: MAX_TOKENS, last: now };
  const delta = now - b.last;
  if (delta > REFILL_MS) {
    b.tokens = Math.min(MAX_TOKENS, b.tokens + Math.floor(delta / REFILL_MS));
    b.last = now;
  }
  if (b.tokens <= 0) {
    buckets[key] = b;
    return false;
  }
  b.tokens -= 1;
  buckets[key] = b;
  return true;
}

async function parseCreds(req: Request) {
  const type = req.headers.get('content-type') || '';
  if (type.includes('application/json')) {
    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    return {
      email: typeof body.email === 'string' ? body.email : '',
      password: typeof body.password === 'string' ? body.password : '',
    };
  }
  const form = await req.formData().catch(() => null);
  return {
    email: form?.get('email')?.toString() || '',
    password: form?.get('password')?.toString() || '',
  };
}

export async function POST(req: Request) {
  const ip = headers().get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
  if (!takeToken(ip)) {
    return NextResponse.json({ ok: false, error: 'Too many attempts' }, { status: 429 });
  }

  const { email, password } = await parseCreds(req);
  if (!email || !password) {
    return NextResponse.json({ ok: false, error: 'Missing credentials' }, { status: 400 });
  }

  const path = process.env.ENGINE_LOGIN_PATH || `/${['login', 'php'].join('.')}`;
  const url = `${process.env.ENGINE_BASE_URL}${path}`;
  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ email, password }),
    });
  } catch {
    return NextResponse.json({ ok: false, error: 'Engine unreachable' }, { status: 502 });
  }

  const name = process.env.JWT_COOKIE_NAME || 'auth_token';
  const secret = process.env.AUTH_SECRET || '';
  const ct = res.headers.get('content-type') || '';

  if (ct.includes('application/json')) {
    const data = await res.json().catch(() => ({}));
    if (typeof data.token === 'string') {
      const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7;
      setSessionCookie(name, data.token, exp);
      return NextResponse.json({ ok: true });
    }
  }

  const set = res.headers.get('set-cookie') || '';
  const m = /PHPSESSID=([^;]+)/i.exec(set);
  if (m) {
    const { token, exp } = signJwt({ email, php: m[1] }, secret);
    setSessionCookie(name, token, exp);
    return NextResponse.json({ ok: true });
  }

  const errTxt = await res.text().catch(() => 'Login failed');
  return NextResponse.json({ ok: false, error: errTxt || 'Login failed' }, { status: 401 });
}

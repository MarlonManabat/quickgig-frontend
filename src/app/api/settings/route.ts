import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sign, unsign } from '@/lib/signedCookie';
import { defaultsFromEnv, mergeSettings } from '@/lib/settings';
import type { Settings } from '@/types/settings';
import { env } from '@/config/env';

const COOKIE = 'settings_v1';
const AUTH_MODE = process.env.ENGINE_AUTH_MODE || '';
const BASE = process.env.ENGINE_BASE_URL || '';

function readCookie(): Settings | null {
  const raw = cookies().get(COOKIE)?.value;
  if (!raw) return null;
  const val = unsign(raw);
  if (!val) return null;
  try {
    return JSON.parse(Buffer.from(val, 'base64').toString('utf8')) as Settings;
  } catch {
    return null;
  }
}

function writeCookie(res: NextResponse, data: Settings) {
  const raw = Buffer.from(JSON.stringify(data)).toString('base64');
  const signed = sign(raw);
  res.headers.append('Set-Cookie', `${COOKIE}=${signed}; Path=/; HttpOnly; SameSite=Lax; Max-Age=31536000`);
}

export async function GET(req: NextRequest) {
  if (!cookies().get(env.JWT_COOKIE_NAME)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  let data = readCookie();
  if (!data && AUTH_MODE && BASE) {
    try {
      const r = await fetch(`${BASE}/api/settings`, { headers: { cookie: req.headers.get('cookie') || '' } });
      if (r.ok) data = (await r.json().catch(() => null)) as Settings | null;
    } catch {
      /* ignore */
    }
  }
  if (!data) data = defaultsFromEnv();
  const res = NextResponse.json(data);
  writeCookie(res, data);
  return res;
}

export async function PATCH(req: NextRequest) {
  if (!cookies().get(env.JWT_COOKIE_NAME)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const patch = (await req.json().catch(() => null)) as Partial<Settings> | null;
  if (!patch) return NextResponse.json({ ok: false }, { status: 400 });
  const prev = readCookie() || defaultsFromEnv();
  const next = mergeSettings(prev, patch);
  const res = NextResponse.json(next);
  writeCookie(res, next);
  if (AUTH_MODE && BASE) {
    fetch(`${BASE}/api/settings`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', cookie: req.headers.get('cookie') || '' },
      body: JSON.stringify(patch),
    }).catch(() => {});
  }
  return res;
}

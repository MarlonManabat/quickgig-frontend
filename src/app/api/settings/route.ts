import { NextResponse, type NextRequest } from 'next/server';
import { cookies as serverCookies } from 'next/headers';
import { sign, unsign } from '@/lib/signedCookie';
import type { UserSettings } from '@/types/settings';
import { env } from '@/config/env';

const COOKIE = 'settings';
const AUTH_MODE = process.env.ENGINE_AUTH_MODE || '';
const BASE = process.env.ENGINE_BASE_URL || '';

function defaults(): UserSettings {
  const lang = (process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE as 'en' | 'tl') === 'tl' ? 'tl' : 'en';
  const pref = process.env.NEXT_PUBLIC_DEFAULT_EMAIL_PREFS || 'none';
  const freq = (process.env.NEXT_PUBLIC_DEFAULT_ALERTS_FREQUENCY as 'off' | 'daily' | 'weekly') || 'weekly';
  let email: UserSettings['email'] = {
    alertsFrequency: freq,
    interviews: false,
    applications: false,
    messages: false,
    marketingAllowed: true,
  };
  if (pref === 'all') {
    email = { alertsFrequency: freq, interviews: true, applications: true, messages: true, marketingAllowed: true };
  } else if (pref === 'alerts_only') {
    email = { alertsFrequency: freq, interviews: false, applications: false, messages: false, marketingAllowed: true };
  } else if (pref === 'none') {
    email = { alertsFrequency: 'off', interviews: false, applications: false, messages: false, marketingAllowed: false };
  }
  return { language: lang, email, updatedAt: new Date().toISOString() };
}

function readCookie(): UserSettings | null {
  const raw = serverCookies().get(COOKIE)?.value;
  if (!raw) return null;
  const val = unsign(raw);
  if (!val) return null;
  try {
    const json = JSON.parse(Buffer.from(val, 'base64').toString('utf8')) as UserSettings;
    return json;
  } catch {
    return null;
  }
}

function writeCookie(res: NextResponse, data: UserSettings) {
  const raw = Buffer.from(JSON.stringify(data)).toString('base64');
  const signed = sign(raw);
  res.headers.append(
    'Set-Cookie',
    `${COOKIE}=${signed}; HttpOnly; SameSite=Lax; Path=/; Max-Age=31536000`,
  );
}

function validate(patch: Partial<UserSettings>): boolean {
  if (patch.language && patch.language !== 'en' && patch.language !== 'tl') return false;
  if (patch.email) {
    const e = patch.email;
    const freq = ['off', 'daily', 'weekly'];
    if (e.alertsFrequency && !freq.includes(e.alertsFrequency)) return false;
    for (const b of ['interviews', 'applications', 'messages', 'marketingAllowed'] as const) {
      if (e[b] != null && typeof e[b] !== 'boolean') return false;
    }
  }
  return true;
}

export async function GET(req: NextRequest) {
  if (!serverCookies().get(env.JWT_COOKIE_NAME)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  let data = readCookie();
  if (!data && AUTH_MODE === 'php' && BASE) {
    try {
      const r = await fetch(`${BASE}/api/settings`, {
        headers: { cookie: req.headers.get('cookie') || '' },
      });
      if (r.ok) {
        const j = await r.json().catch(() => ({}));
        data = (j && typeof j === 'object' && 'data' in j ? j.data : j) as UserSettings;
      }
    } catch {
      /* ignore */
    }
  }
  if (!data) data = defaults();
  const res = NextResponse.json(data);
  writeCookie(res, data);
  return res;
}

export async function PUT(req: NextRequest) {
  if (!serverCookies().get(env.JWT_COOKIE_NAME)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const patch = (await req.json().catch(() => null)) as Partial<UserSettings> | null;
  if (!patch || !validate(patch)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const prev = readCookie() || defaults();
  const next: UserSettings = {
    ...prev,
    ...patch,
    email: { ...prev.email, ...(patch.email || {}) },
    updatedAt: new Date().toISOString(),
  };
  const res = NextResponse.json(next);
  writeCookie(res, next);
  if (AUTH_MODE === 'php' && BASE) {
    fetch(`${BASE}/api/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        cookie: req.headers.get('cookie') || '',
      },
      body: JSON.stringify(next),
    }).catch((err) => {
      // eslint-disable-next-line no-console
      console.warn('[settings] upstream failed', err);
    });
  }
  return res;
}


import * as cheerio from 'cheerio';

const MODE = process.env.ENGINE_AUTH_MODE || 'mock';
const BASE = process.env.ENGINE_BASE_URL || 'https://quickgig.ph';
const LOGIN = process.env.ENGINE_LOGIN_PATH || `/${['login', 'php'].join('.')}`;

export type EngineAuthResult = { ok: boolean; message?: string };

export async function engineLogin(
  email: string,
  password: string,
): Promise<EngineAuthResult> {
  if (MODE === 'mock') {
    const ok = !!email && !!password;
    return ok ? { ok: true } : { ok: false, message: 'Missing credentials' };
  }

  const url = `${BASE}${LOGIN}`;
  const res = await fetch(url, {
    method: 'POST',
    redirect: 'manual',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ email, password }).toString(),
  });

  if (res.status >= 300 && res.status < 400) return { ok: true };
  const html = await res.text();
  try {
    const $ = cheerio.load(html);
    const text = $('body').text() || '';
    if (/invalid|wrong|mali|error/i.test(text)) {
      return { ok: false, message: 'Invalid email or password' };
    }
    return { ok: true };
  } catch {
    return { ok: false, message: 'Unexpected engine response' };
  }
}


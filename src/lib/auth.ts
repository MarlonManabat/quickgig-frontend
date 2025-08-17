import type { IncomingMessage } from 'http';
import type { GetServerSidePropsContext } from 'next';
import type { Session, Role } from '@/types/user';

const COOKIE_NAME = 'auth_token';
const BASE_URL = process.env.ENGINE_BASE_URL || '';
const LOGIN_PATH = process.env.ENGINE_LOGIN_PATH || '/api/session/login';
const LOGOUT_PATH = process.env.ENGINE_LOGOUT_PATH || '/api/session/logout';
const MODE = process.env.ENGINE_AUTH_MODE || 'mock';

function parseCookies(cookieHeader?: string): Record<string, string> {
  const list: Record<string, string> = {};
  if (!cookieHeader) return list;
  cookieHeader.split(';').forEach((cookie) => {
    const parts = cookie.split('=');
    const key = parts.shift()?.trim();
    if (!key) return;
    const value = decodeURIComponent(parts.join('='));
    list[key] = value;
  });
  return list;
}

export async function getSession(req?: IncomingMessage): Promise<Session> {
  if (MODE === 'mock') {
    let token: string | undefined;
    if (req?.headers?.cookie) {
      token = parseCookies(req.headers.cookie)[COOKIE_NAME];
    } else if (typeof document !== 'undefined') {
      token = parseCookies(document.cookie)[COOKIE_NAME];
    }
    if (!token) return null;
    const [rawRole, email = ''] = token.split(':');
    const role: Role = rawRole === 'employer' ? 'employer' : rawRole === 'admin' ? 'admin' : 'applicant';
    return { id: email, email, name: email.split('@')[0] || email, role };
  }
  try {
    const r = await fetch(`${BASE_URL}/api/session/status`, {
      method: 'GET',
      headers: req?.headers.cookie ? { cookie: req.headers.cookie } : undefined,
      credentials: 'include',
    });
    if (!r.ok) return null;
      const data: unknown = await r.json().catch(() => ({}));
      const u = (data as { user?: EngineUserLike }).user || (data as EngineUserLike);
      if (!u || !u.id || !u.email || !u.name || !u.role) return null;
      return { id: String(u.id), email: u.email, name: u.name, role: u.role };
  } catch {
    return null;
  }
}

export async function login(email: string, password: string): Promise<{ session: Session; cookie?: string | string[] }> {
  if (MODE === 'mock') {
    const role: Role = /@biz/.test(email) || /\+emp/.test(email) ? 'employer' : 'applicant';
    const token = `${role}:${email}`;
    const session: Session = { id: email, email, name: email.split('@')[0] || email, role };
    return { session, cookie: token };
  }
  try {
    const r = await fetch(`${BASE_URL}${LOGIN_PATH}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });
    if (!r.ok) return { session: null };
    const data: unknown = await r.json().catch(() => ({}));
    const u = (data as { user?: EngineUserLike }).user || (data as EngineUserLike);
    if (!u || !u.id || !u.email || !u.name || !u.role) return { session: null };
    const session: Session = { id: String(u.id), email: u.email, name: u.name, role: u.role };
    const setCookie = r.headers.get('set-cookie') || r.headers.get('Set-Cookie') || undefined;
    return { session, cookie: setCookie ? setCookie.split(',') : undefined };
  } catch {
    return { session: null };
  }
}

export async function logout(): Promise<void> {
  if (MODE === 'mock') {
    if (typeof document !== 'undefined') {
      document.cookie = `${COOKIE_NAME}=; Max-Age=0; path=/;`;
    }
    return;
  }
  try {
    await fetch(`${BASE_URL}${LOGOUT_PATH}`, { method: 'POST', credentials: 'include' });
  } catch {
    // ignore
  }
}

type EngineUserLike = { id?: string | number; email?: string; name?: string; role?: Role };

export function requireAuthSSR<T extends Record<string, unknown>>(roles?: Role[], handler?: (ctx: GetServerSidePropsContext, session: NonNullable<Session>) => Promise<T> | T) {
  return async (ctx: GetServerSidePropsContext) => {
    const { req, resolvedUrl } = ctx;
    const session = await getSession(req);
    if (!session || (roles && !roles.includes(session.role))) {
      return {
        redirect: { destination: `/login?next=${encodeURIComponent(resolvedUrl)}`, permanent: false },
      };
    }
    const extra = handler ? await handler(ctx, session) : ({} as T);
    return { props: { session, ...(extra as T) } };
  };
}

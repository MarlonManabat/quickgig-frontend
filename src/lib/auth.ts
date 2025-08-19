import { guardAgainstPhpOrigin } from './fetchGuard';
import { api } from '@/config/api';

export async function login(payload: Record<string, string>) {
  const url = api.session.login;
  guardAgainstPhpOrigin(url);
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
    cache: 'no-store',
    credentials: 'include',
  });
  if (!res.ok) throw new Error(`Login failed: ${res.status}`);
  return res;
}

export async function register(
  payload: URLSearchParams | Record<string, string>
) {
  const body =
    payload instanceof URLSearchParams
      ? payload
      : new URLSearchParams(payload as Record<string, string>);
  const url = '/api/session/register';
  guardAgainstPhpOrigin(url);
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
    credentials: 'include',
  });
  if (!res.ok) throw new Error(`Register failed: ${res.status}`);
  return res;
}

export async function me() {
  const url = api.session.me;
  guardAgainstPhpOrigin(url);
  const r = await fetch(url, { credentials: 'include', cache: 'no-store' });
  return r.json().catch(() => ({}));
}

// Token helpers removed – rely on HttpOnly cookies only

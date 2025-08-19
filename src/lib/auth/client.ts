'use client';

import { guardAgainstPhpOrigin } from '@/lib/fetchGuard';

async function json(res: Response) { return res.json().catch(() => ({})); }

export async function login(payload: URLSearchParams | Record<string, string>) {
  const body =
    payload instanceof URLSearchParams
      ? payload
      : new URLSearchParams(payload as Record<string, string>);
  const url = '/api/session/login';
  guardAgainstPhpOrigin(url);
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
    credentials: 'include',
  });
  if (!res.ok) throw new Error(`Login failed: ${res.status}`);
  return res;
}

export async function register(payload: URLSearchParams | Record<string, string>) {
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
  const url = '/api/session/me';
  guardAgainstPhpOrigin(url);
  const r = await fetch(url, { credentials: 'include' });
  return json(r);
}


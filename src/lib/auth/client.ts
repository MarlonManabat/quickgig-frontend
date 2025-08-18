'use client';

async function json(res: Response) { return res.json().catch(() => ({})); }

export async function login(email: string, password: string) {
  const body = new URLSearchParams({ email, password });
  const r = await fetch('/api/session/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
    credentials: 'include',
  });
  return json(r);
}

export async function register(payload: { email: string; password: string; name?: string }) {
  const body = new URLSearchParams(payload as Record<string, string>);
  const r = await fetch('/api/session/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
    credentials: 'include',
  });
  return json(r);
}

export async function me() {
  const r = await fetch('/api/session/me', { credentials: 'same-origin' });
  return json(r);
}

'use client';

async function json(res: Response) { return res.json().catch(() => ({})); }

export async function login(email: string, password: string) {
  const r = await fetch('/api/session/login', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }), credentials: 'same-origin',
  });
  return json(r);
}

export async function register(payload: { email: string; password: string; name?: string }) {
  const r = await fetch('/api/session/register', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload), credentials: 'same-origin',
  });
  return json(r);
}

export async function me() {
  const r = await fetch('/api/session/me', { credentials: 'same-origin' });
  return json(r);
}

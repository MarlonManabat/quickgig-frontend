'use client';

async function post(path: string, body: Record<string, unknown>) {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    credentials: 'same-origin',
  });
  return res.json().catch(() => ({}));
}

export async function login(email: string, password: string) {
  return post('/api/session/login', { email, password });
}

export async function register(payload: { email: string; password: string; name?: string }) {
  return post('/api/session/register', payload);
}

export async function me() {
  const res = await fetch('/api/session/me', { credentials: 'same-origin' });
  return res.json().catch(() => ({}));
}

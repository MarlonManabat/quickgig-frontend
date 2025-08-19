import { cookies } from 'next/headers';
import { env } from '@/config/env';

export async function upstream(path: string, init?: RequestInit) {
  const token = cookies().get(env.cookieName)?.value;
  const headers = new Headers(init?.headers);
  headers.set('accept', 'application/json');
  if (token) headers.set('authorization', `Bearer ${token}`);
  return fetch(new URL(path, env.apiUrl), { ...init, headers, cache: 'no-store' });
}

export async function loginUpstream(body: unknown) {
  return fetch(new URL('/auth/login', env.apiUrl), {
    method: 'POST',
    headers: { 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify(body),
    cache: 'no-store',
  });
}

export async function registerUpstream(body: unknown) {
  return fetch(new URL('/auth/register', env.apiUrl), {
    method: 'POST',
    headers: { 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify(body),
    cache: 'no-store',
  });
}

export async function logoutUpstream() {
  return upstream('/auth/logout', { method: 'POST' });
}

export async function meUpstream() {
  return upstream('/auth/me', { method: 'GET' });
}

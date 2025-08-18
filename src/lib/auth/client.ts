'use client';

import { fetchJson } from '@/lib/http';

interface AuthResponse {
  ok?: boolean;
  message?: string;
  [key: string]: unknown;
}

export async function login(
  email: string,
  password: string,
): Promise<AuthResponse> {
  return fetchJson<AuthResponse>('/api/session/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
}

export async function register(payload: {
  email: string;
  password: string;
  name?: string;
}): Promise<AuthResponse> {
  return fetchJson<AuthResponse>('/api/session/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function me(): Promise<any> {
  return fetchJson<any>('/api/session/me');
}

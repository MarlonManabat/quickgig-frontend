import { apiPost, apiGet, BASE } from './api';

export interface User {
  id: number;
  email: string;
  name: string | null;
  phone: string | null;
}

export function register(email: string, password: string, name?: string) {
  return apiPost<User>('/auth/register.php', { email, password, name });
}

export function login(email: string, password: string) {
  return apiPost<User>('/auth/login.php', { email, password });
}

export function logout() {
  return apiPost<{ ok: boolean }>('/auth/logout.php', {});
}

export function me() {
  return apiGet<User>('/auth/me.php');
}

export async function updateProfile(data: { name?: string; phone?: string }) {
  const res = await fetch(`${BASE}/profile/update.php`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return res.json() as Promise<{ ok: boolean; user: User }>;
}

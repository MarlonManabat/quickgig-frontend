export const API_URL = process.env.NEXT_PUBLIC_API_URL!;

type Options = RequestInit & { auth?: boolean };

export async function api(path: string, opts: Options = {}) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(opts.headers as any),
  };
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  if (opts.auth && token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    ...opts,
    headers,
    credentials: 'include',
  });
  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    throw new Error('Unauthorized');
  }
  if (!res.ok) throw new Error(await res.text());
  const ct = res.headers.get('content-type') || '';
  return ct.includes('application/json') ? res.json() : res.text();
}

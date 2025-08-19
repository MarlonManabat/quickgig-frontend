import { BASE } from './env';

interface ApiError extends Error {
  status?: number;
  url?: string;
}

function timeoutSignal(ms: number): AbortSignal {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), ms);
  return controller.signal;
}

async function request(path: string, init: RequestInit & { timeout?: number } = {}) {
  const url = `${BASE.replace(/\/$/, '')}${path}`;
  const { timeout = 10000, headers, body, ...rest } = init;
  const res = await fetch(url, {
    ...rest,
    headers: {
      Accept: 'application/json',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(headers || {}),
    },
    body,
    signal: timeoutSignal(timeout),
  });
  if (!res.ok) {
    let message = res.statusText;
    try {
      const data = await res.json();
      message = data.message || message;
    } catch {
      /* ignore */
    }
    const err: ApiError = new Error(message);
    err.status = res.status;
    err.url = url;
    throw err;
  }
  return res;
}

export async function apiGet<T>(path: string, opts?: RequestInit & { timeout?: number }): Promise<T> {
  const res = await request(path, { ...opts, method: 'GET' });
  return res.json() as Promise<T>;
}

export async function apiPost<T>(path: string, body: unknown, opts?: RequestInit & { timeout?: number }): Promise<T> {
  const res = await request(path, {
    ...opts,
    method: 'POST',
    body: JSON.stringify(body),
  });
  return res.json() as Promise<T>;
}

export { BASE };

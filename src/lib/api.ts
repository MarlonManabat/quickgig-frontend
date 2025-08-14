import { safeJsonParse } from './json';

/**
 * Returns the base URL for the QuickGig API.
 * Throws if NEXT_PUBLIC_API_URL is not defined.
 */
export function getBaseUrl(): string {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) throw new Error('NEXT_PUBLIC_API_URL is not set');
  return base;
}

/**
 * Fetches from the QuickGig API with a 5 second timeout and
 * returns a simplified response object.
 */
export async function safeFetch(
  path: string,
  init?: RequestInit,
): Promise<{ ok: boolean; status: number; body: string; error?: string }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch(`${getBaseUrl()}${path}`, {
      ...init,
      signal: controller.signal,
    });
    const body = await res.text();
    return { ok: res.ok, status: res.status, body };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      body: '',
      error: err instanceof Error ? err.message : String(err),
    };
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Convenience helper for JSON APIs used across the app.
 * Throws on non-2xx responses or invalid JSON.
 */
export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await safeFetch(path, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    ...init,
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${res.body}`);
  const json = safeJsonParse<T>(res.body);
  if (!json.ok) throw json.error;
  return json.value as T;
}


import { safeJsonParse } from './json';
import type { Job } from '../../types/jobs';

export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || 'https://api.quickgig.ph';

export function get(path: string, init?: RequestInit) {
  return fetch(`${API_BASE}${path}`, { ...init, method: 'GET' });
}

export function post(path: string, body: unknown, init?: RequestInit) {
  return fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    body: JSON.stringify(body),
    ...init,
  });
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
    const res = await fetch(`${API_BASE}${path}`, {
      mode: 'cors',
      ...init,
      credentials: 'include',
      signal: controller.signal,
    });
    const body = await res.text();
    return { ok: res.ok, status: res.status, body };
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    console.error('safeFetch error:', error);
    return { ok: false, status: 0, body: '', error };
  } finally {
    clearTimeout(timeout);
  }
}

export interface HealthResponse {
  ok: boolean;
  status: number;
  body: string;
  path: string;
  latency: number;
  error?: string;
}

/**
 * Try /health then /health.php. Returns the first successful result
 * or the final failure.
 */
export async function checkHealth(): Promise<HealthResponse> {
  const paths = ['/health', '/health.php'];
  for (const path of paths) {
    const start = Date.now();
    const res = await safeFetch(path);
    const latency = Date.now() - start;
    const parsed = safeJsonParse<{ status?: string }>(res.body);
    const ok =
      res.ok &&
      parsed.ok &&
      parsed.value?.status &&
      String(parsed.value.status).toLowerCase() === 'ok';
    if (ok) return { ...res, path, latency };
    if (res.error) console.error(`Health check ${path} error:`, res.error);
    if (!parsed.ok)
      console.error(`Health check ${path} parse error:`, parsed.error);
  }
  return { ok: false, status: 0, body: '', path: '/health.php', latency: 0, error: 'Health check failed' };
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

export async function fetchJobs(): Promise<Job[]> {
  return apiFetch<Job[]>('/jobs');
}


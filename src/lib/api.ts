import { safeJsonParse } from './json';

let cachedBase: string | undefined;

/**
 * Resolve the QuickGig API base URL once. Defaults to the public
 * production API if the env variable is missing.
 */
export function getApiBase(): string {
  if (!cachedBase)
    cachedBase =
      process.env.NEXT_PUBLIC_API_URL ?? 'https://api.quickgig.ph';
  return cachedBase;
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
    const res = await fetch(`${getApiBase()}${path}`, {
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


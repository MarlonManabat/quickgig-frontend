import { safeJsonParse } from './json';
import { toast } from './toast';
import { report } from './report';
import type { Job } from '../../types/jobs';

const BASE = '/gate';

async function apiRequest(path: string, init?: RequestInit) {
  return fetch(`${BASE}${path}`, {
    cache: 'no-store',
    credentials: 'include',
    ...init,
  });
}

export const apiRaw = apiRequest;

export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await apiRequest(path, { ...init, method: 'GET' });
  if (!res.ok) throw new Error(`GET ${path} -> ${res.status}`);
  return res.json();
}

export async function apiPost<T>(path: string, body: unknown, init?: RequestInit): Promise<T> {
  const res = await apiRequest(path, {
    ...init,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST ${path} -> ${res.status}`);
  return res.json();
}

export async function apiPut<T>(path: string, body: unknown, init?: RequestInit): Promise<T> {
  const res = await apiRequest(path, {
    ...init,
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`PUT ${path} -> ${res.status}`);
  return res.json();
}

export async function apiPatch<T>(path: string, body: unknown, init?: RequestInit): Promise<T> {
  const res = await apiRequest(path, {
    ...init,
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`PATCH ${path} -> ${res.status}`);
  return res.json();
}

export async function apiDelete<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await apiRequest(path, { ...init, method: 'DELETE' });
  if (!res.ok) throw new Error(`DELETE ${path} -> ${res.status}`);
  return res.json();
}

export async function safeFetch(
  path: string,
  init?: RequestInit,
): Promise<{ ok: boolean; status: number; body: string; error?: string }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await apiRequest(path, { ...init, signal: controller.signal });
    const body = await res.text();
    return { ok: res.ok, status: res.status, body };
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    report(error, `safeFetch ${path}`);
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

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  try {
    const res = await safeFetch(path, {
      headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
      ...init,
    });
    if (!res.ok) throw new Error(`API ${res.status}: ${res.body}`);
    const json = safeJsonParse<T>(res.body);
    if (!json.ok) throw json.error;
    return json.value as T;
  } catch (error) {
    report(error, `apiFetch ${path}`);
    toast('Something went wrong. Please try again.');
    throw error instanceof Error ? error : new Error(String(error));
  }
}

export async function fetchJobs(): Promise<Job[]> {
  return apiFetch<Job[]>('/jobs');
}

export const API_BASE = BASE;


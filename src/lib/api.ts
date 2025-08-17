import { safeJsonParse } from './json';
import { toast } from './toast';
import { report } from './report';
import { env } from '@/config/env';
import type { Job } from '../../types/jobs';

export const API_BASE = env.NEXT_PUBLIC_API_URL;

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

// --- Minimal API client for product home ---
export type JobSummary = {
  id: string | number;
  title: string;
  company?: string;
  location?: string;
  payRange?: string;
  url?: string;
};

const BASE = (process.env.NEXT_PUBLIC_API_BASE ?? '').replace(/\/+$/,''); // '' => same-origin

async function getJSON<T>(path: string, init?: RequestInit): Promise<T> {
  const url = (BASE ? BASE : '') + path;
  const r = await fetch(url, { ...init, headers: { 'accept':'application/json', ...(init?.headers||{}) } });
  if (!r.ok) throw new Error(`GET ${path} ${r.status}`);
  return r.json() as Promise<T>;
}

export async function health(): Promise<{ ok: boolean }> {
  try { await getJSON('/_health'); return { ok: true }; } catch { return { ok: false }; }
}

/** Try several endpoints (any can work); map to JobSummary[]; swallow errors and return [] */
export async function featuredJobs(limit = 8): Promise<JobSummary[]> {
  const candidates = [
    `/jobs?limit=${limit}&featured=1`,
    `/jobs/featured?limit=${limit}`,
    `/public/jobs?limit=${limit}&featured=1`,
  ];
  for (const p of candidates) {
    try {
      const data = await getJSON<unknown>(p);
      // Normalize common shapes
      const arr: unknown[] = Array.isArray(data)
        ? data
        : Array.isArray((data as { items?: unknown[] }).items)
        ? (data as { items?: unknown[] }).items!
        : Array.isArray((data as { data?: unknown[] }).data)
        ? (data as { data?: unknown[] }).data!
        : [];
      if (!arr.length) continue;
      return arr.slice(0, limit).map((j): JobSummary => {
        interface LooseJob {
          id?: string | number;
          jobId?: string | number;
          slug?: string;
          title?: string;
          name?: string;
          company?: string | { name?: string };
          org?: string;
          location?: string | { name?: string };
          city?: string;
          payRange?: string;
          salary?: string;
          url?: string;
        }
        const job = j as LooseJob;
        const company =
          typeof job.company === 'string'
            ? job.company
            : job.company?.name;
        const location =
          typeof job.location === 'string'
            ? job.location
            : (job.location as { name?: string } | undefined)?.name ?? job.city;
        return {
          id: job.id ?? job.jobId ?? job.slug ?? String(Math.random()).slice(2),
          title: job.title ?? job.name ?? 'Untitled',
          company: company ?? job.org ?? undefined,
          location: location ?? undefined,
          payRange: job.payRange ?? job.salary ?? undefined,
          url: job.url ?? (typeof job.id !== 'undefined' ? `/jobs/${job.id}` : undefined),
        };
      });
    } catch { /* try next shape */ }
  }
  return [];
}

export type JobSearchParams = {
  q?: string;
  location?: string;
  page?: number;
  limit?: number;
};

/** Search jobs by q/location. Attempts several endpoints & shapes, returns a normalized page. */
export async function searchJobs(
  { q = '', location = '', page = 1, limit = 20 }: JobSearchParams
): Promise<{ items: JobSummary[]; total?: number; page: number; limit: number; }> {
  const qs = new URLSearchParams();
  if (q) qs.set('q', q);
  if (location) qs.set('location', location);
  qs.set('page', String(page));
  qs.set('limit', String(limit));
  const paths = [
    `/jobs?${qs}`,
    `/public/jobs?${qs}`,
    `/search/jobs?${qs}`,
  ];
  for (const p of paths) {
    try {
      const data = await getJSON<unknown>(p);
      const arr: unknown[] =
        Array.isArray(data) ? data
        : Array.isArray((data as { items?: unknown[] }).items) ? (data as { items?: unknown[] }).items!
        : Array.isArray((data as { data?: unknown[] }).data) ? (data as { data?: unknown[] }).data!
        : [];
      const items = arr.map((j): JobSummary => {
        interface LooseJob {
          id?: string | number;
          jobId?: string | number;
          slug?: string;
          title?: string;
          name?: string;
          company?: { name?: string } | string;
          org?: string;
          location?: { name?: string } | string;
          city?: string;
          payRange?: string;
          salary?: string;
          url?: string;
        }
        const job = j as LooseJob;
        return {
          id: job.id ?? job.jobId ?? job.slug ?? String(Math.random()).slice(2),
          title: job.title ?? job.name ?? 'Untitled',
          company: typeof job.company === 'string' ? job.company : job.company?.name ?? job.org ?? undefined,
          location: typeof job.location === 'string' ? job.location : job.location?.name ?? job.city ?? undefined,
          payRange: job.payRange ?? job.salary ?? undefined,
          url: job.url ?? (typeof job.id !== 'undefined' ? `/jobs/${job.id}` : undefined),
        };
      });
      const total = typeof (data as { total?: number }).total === 'number' ? (data as { total?: number }).total
        : typeof (data as { count?: number }).count === 'number' ? (data as { count?: number }).count
        : undefined;
      return { items, total, page, limit };
    } catch { /* try next */ }
  }
  return { items: [], page, limit };
}


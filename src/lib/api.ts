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
  tags?: string[];
};
export type JobDetail = JobSummary & {
  description?: string;
  postedAt?: string;
};

export type SearchParams = {
  q?: string;
  loc?: string;
  cat?: string;
  sort?: 'new' | 'pay' | 'relevant';
  page?: number;
  size?: number;
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

/** Search jobs with optional filters */
export async function searchJobs(p: SearchParams = {}): Promise<{ items: JobSummary[]; total?: number }> {
  const qs = new URLSearchParams();
  if (p.q) qs.set('q', p.q.trim());
  if (p.loc) qs.set('loc', p.loc.trim());
  if (p.cat) qs.set('cat', p.cat.trim());
  if (p.sort) qs.set('sort', p.sort);
  if (p.page && p.page > 1) qs.set('page', String(p.page));
  if (p.size && p.size > 0) qs.set('size', String(p.size));
  const url = `/jobs/search?${qs.toString()}`;
  try {
    const data = await getJSON<{ items?: JobSummary[]; total?: number } | JobSummary[]>(url);
    if (Array.isArray(data)) return { items: data, total: undefined };
    return { items: data.items ?? [], total: data.total };
  } catch {
    return { items: [] };
  }
}

/** Normalize various job detail payload shapes to JobDetail */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normDetail(j: any): JobDetail {
  const id = j?.id ?? j?.jobId ?? j?.slug ?? String(Math.random()).slice(2);
  return {
    id,
    title: j?.title ?? j?.name ?? 'Untitled',
    company: j?.company?.name ?? j?.company ?? j?.org ?? undefined,
    location: j?.location?.name ?? j?.location ?? j?.city ?? undefined,
    payRange: j?.payRange ?? j?.salary ?? undefined,
    url: j?.url ?? (typeof id !== 'undefined' ? `/jobs/${id}` : undefined),
    description: j?.description ?? j?.desc ?? j?.body ?? undefined,
    tags: Array.isArray(j?.tags) ? j.tags : undefined,
    postedAt: j?.postedAt ?? j?.createdAt ?? j?.publishedAt ?? undefined,
  };
}

/** Fetch a single job detail by id across a few endpoints/envelopes. */
export async function getJobDetails(id: string | number): Promise<JobDetail | null> {
  const paths = [
    `/jobs/${id}`,
    `/public/jobs/${id}`,
    `/job/${id}`,
  ];
  for (const p of paths) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = await getJSON<any>(p);
      const obj =
        (data && !Array.isArray(data) && typeof data === 'object') ? (
          data.data ?? data.item ?? data.job ?? data
        ) : null;
      if (obj) return normDetail(obj);
    } catch {/* try next */}
  }
  return null;
}


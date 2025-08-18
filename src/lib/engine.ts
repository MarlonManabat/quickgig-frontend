import type { NextApiRequest } from 'next';

const MODE = process.env.ENGINE_MODE || 'mock';
const BASE = process.env.ENGINE_BASE_URL || '';
const ALLOW_FALLBACK = process.env.ALLOW_ENGINE_FALLBACK === 'true';

export type EngineError = { status: number; message: string };

async function attempt(method: string, path: string, req?: NextApiRequest, body?: unknown): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);
  try {
    const headers: Record<string, string> = { 'content-type': 'application/json' };
    if (req?.headers.cookie) headers.cookie = req.headers.cookie;
    const res = await fetch(BASE + path, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
    return res;
  } finally {
    clearTimeout(timer);
  }
}

async function request<T>(method: string, path: string, req?: NextApiRequest, body?: unknown, fallback?: () => Promise<T>): Promise<T> {
  if (MODE !== 'php') {
    if (fallback) return fallback();
    throw { status: 500, message: 'ENGINE_MODE is mock' } as EngineError;
  }
  for (let i = 0; i < 2; i++) {
    try {
      const res = await attempt(method, path, req, body);
      const text = await res.text();
      const data = text ? JSON.parse(text) : undefined;
      if (!res.ok) {
        throw { status: res.status, message: data?.message || data?.error || text } as EngineError;
      }
      return data as T;
    } catch (err: unknown) {
      const e = err as EngineError;
      if (i === 0 && (e.status === 429 || e.status >= 500)) {
        await new Promise((r) => setTimeout(r, 500));
        continue;
      }
      if (fallback && ALLOW_FALLBACK) return fallback();
      throw e;
    }
  }
  if (fallback && ALLOW_FALLBACK) return fallback();
  throw { status: 500, message: 'Engine request failed' } as EngineError;
}

async function raw(method: string, path: string, req?: NextApiRequest, body?: unknown, fallback?: () => Promise<Response>): Promise<Response> {
  if (MODE !== 'php') {
    if (fallback) return fallback();
    throw new Error('ENGINE_MODE is mock');
  }
  for (let i = 0; i < 2; i++) {
    try {
      return await attempt(method, path, req, body);
    } catch (err: unknown) {
      const e = err as EngineError;
      if (i === 0 && (e.status === 429 || e.status >= 500)) {
        await new Promise((r) => setTimeout(r, 500));
        continue;
      }
      if (fallback && ALLOW_FALLBACK) return fallback();
      throw e;
    }
  }
  if (fallback && ALLOW_FALLBACK) return fallback();
  throw new Error('Engine request failed');
}

export const get = <T>(path: string, req?: NextApiRequest, fallback?: () => Promise<T>) => request<T>('GET', path, req, undefined, fallback);
export const post = <T>(path: string, body?: unknown, req?: NextApiRequest, fallback?: () => Promise<T>) => request<T>('POST', path, req, body, fallback);
export const patch = <T>(path: string, body?: unknown, req?: NextApiRequest, fallback?: () => Promise<T>) => request<T>('PATCH', path, req, body, fallback);
export const del = <T>(path: string, req?: NextApiRequest, body?: unknown, fallback?: () => Promise<T>) => request<T>('DELETE', path, req, body, fallback);
export const rawRequest = (method: string, path: string, req?: NextApiRequest, body?: unknown) => raw(method, path, req, body);

export const PATHS = {
  auth: {
    session: '/api/session',
    login: process.env.ENGINE_LOGIN_PATH || '/api/session/login',
    logout: process.env.ENGINE_LOGOUT_PATH || '/api/session/logout',
  },
  jobs: {
    search: '/api/jobs',
    detail: (id: string | number) => `/api/jobs/${id}`,
  },
  apply: {
    submit: '/api/applications',
  },
  profile: {
    get: '/api/profile',
    update: '/api/profile',
  },
  applications: {
    list: '/api/applications',
    update: (id: string | number) => `/api/applications/${id}`,
    withdraw: (id: string | number) => `/api/applications/${id}`,
  },
  employer: {
    company: '/api/company',
    jobs: '/api/employer/jobs',
    jobDetail: (id: string | number) => `/api/employer/jobs/${id}`,
    jobStatus: (id: string | number) => `/api/employer/jobs/${id}/status`,
    applicants: (jobId: string | number) => `/api/employer/jobs/${jobId}/applicants`,
    applicant: (jobId: string | number, appId: string | number) => `/api/employer/jobs/${jobId}/applications/${appId}`,
  },
  messages: {
    threads: '/api/messages',
    thread: (id: string | number) => `/api/messages/${id}`,
    send: (id: string | number) => `/api/messages/${id}/send`,
    read: (id: string | number) => `/api/messages/${id}/read`,
  },
  interviews: {
    list: (appId: string) => `/api/applications/${appId}/interviews`,
    create: '/api/interviews',
    update: (id: string) => `/api/interviews/${id}`,
    invites: (id: string) => `/api/interviews/${id}/invite`,
    rsvp: (id: string) => `/api/interviews/${id}/rsvp`,
  },
  alerts: {
    list: '/api/alerts',
    create: '/api/alerts',
    update: (id: string | number) => `/api/alerts/${id}`,
    del: (id: string | number) => `/api/alerts/${id}`,
  },
  events: {
    stream: '/events',
  },
};


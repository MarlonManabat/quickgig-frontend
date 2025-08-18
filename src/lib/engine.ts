import type { NextApiRequest } from 'next';

export class EngineError extends Error {
  status: number;
  data?: unknown;
  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

const MODE = process.env.ENGINE_MODE || 'mock';
const BASE = (process.env.ENGINE_BASE_URL || '').replace(/\/$/, '');
const ALLOW_FALLBACK = process.env.ALLOW_ENGINE_FALLBACK === 'true';

export const isEngineOn = () => MODE === 'php';

export interface EngineInit extends RequestInit {
  req?: NextApiRequest;
}

async function rawFetch(path: string, init: EngineInit = {}): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);
  try {
    const headers: Record<string, string> = {
      ...(init.headers as Record<string, string> | undefined),
    };
    if (init.req?.headers.cookie) headers.cookie = init.req.headers.cookie;
    const auth = init.req?.headers.authorization;
    if (auth) headers.authorization = Array.isArray(auth) ? auth[0] : auth;
    return await fetch(BASE + path, { ...init, headers, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export async function engineFetch<T>(path: string, init: EngineInit = {}): Promise<T> {
  if (!isEngineOn()) throw new EngineError(500, 'ENGINE_MODE is mock');
  let attempt = 0;
  let delay = 250;
  for (;;) {
    try {
      const res = await rawFetch(path, init);
      const text = await res.text();
      const data = text ? JSON.parse(text) : undefined;
      if (!res.ok) {
        throw new EngineError(res.status, data?.message || data?.error || res.statusText, data);
      }
      return data as T;
    } catch (err) {
      attempt += 1;
      if (attempt >= 3) throw err;
      await new Promise((r) => setTimeout(r, delay));
      delay *= 2;
    }
  }
}

export async function withFallback<T>(fnEngine: () => Promise<T>, fnMock?: () => Promise<T>): Promise<T> {
  if (!isEngineOn()) {
    if (fnMock) return fnMock();
    throw new EngineError(500, 'ENGINE_MODE is mock');
  }
  try {
    return await fnEngine();
  } catch (err) {
    if (fnMock && ALLOW_FALLBACK) return fnMock();
    throw err;
  }
}

export const get = <T>(path: string, req?: NextApiRequest, fallback?: () => Promise<T>) =>
  withFallback(() => engineFetch<T>(path, { method: 'GET', req }), fallback);

export const post = <T>(path: string, body?: unknown, req?: NextApiRequest, fallback?: () => Promise<T>) =>
  withFallback(
    () =>
      engineFetch<T>(path, {
        method: 'POST',
        req,
        headers: { 'content-type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
      }),
    fallback,
  );

export const patch = <T>(path: string, body?: unknown, req?: NextApiRequest, fallback?: () => Promise<T>) =>
  withFallback(
    () =>
      engineFetch<T>(path, {
        method: 'PATCH',
        req,
        headers: { 'content-type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
      }),
    fallback,
  );

export const del = <T>(path: string, req?: NextApiRequest, body?: unknown, fallback?: () => Promise<T>) =>
  withFallback(
    () =>
      engineFetch<T>(path, {
        method: 'DELETE',
        req,
        headers: { 'content-type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
      }),
    fallback,
  );

export const rawRequest = (method: string, path: string, req?: NextApiRequest, body?: unknown) => {
  if (!isEngineOn()) throw new Error('ENGINE_MODE is mock');
  return rawFetch(path, {
    method,
    req,
    headers: { 'content-type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
};

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


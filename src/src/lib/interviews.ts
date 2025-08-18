import type { Interview, InterviewStatus } from '../types/interview';

const KEY = 'qg_interviews_v1';
const MODE = process.env.ENGINE_MODE || 'mock';
const BASE = process.env.ENGINE_BASE_URL || '';

function read(): Interview[] {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) return JSON.parse(raw) as Interview[];
    } catch {}
  }
  const g = globalThis as { __qg_interviews?: Interview[] };
  if (!g.__qg_interviews) g.__qg_interviews = [] as Interview[];
  return g.__qg_interviews;
}

function write(list: Interview[]) {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(list));
    } catch {}
  } else {
    const g = globalThis as { __qg_interviews?: Interview[] };
    g.__qg_interviews = list;
  }
}

export function listAll(): Interview[] {
  return read();
}
async function fetchOrFallback(url: string, init?: RequestInit): Promise<Response | null> {
  try {
    const r = await fetch(url, init);
    if (r.status !== 404) return r;
  } catch {}
  return null;
}

export async function listByApp(appId: string): Promise<Interview[]> {
  if (MODE !== 'mock') {
    const r = await fetchOrFallback(`${BASE}/api/interviews?appId=${appId}`, { credentials: 'include' });
    if (r) {
      try {
        return (await r.json()) as Interview[];
      } catch {}
    }
  }
  const list = read();
  return list.filter((i) => i.appId === appId);
}

export async function listByEmployer(employerId: string): Promise<Interview[]> {
  if (MODE !== 'mock') {
    const r = await fetchOrFallback(`${BASE}/api/interviews?employerId=${employerId}`, { credentials: 'include' });
    if (r) {
      try {
        return (await r.json()) as Interview[];
      } catch {}
    }
  }
  const list = read();
  return list.filter((i) => i.employerId === employerId);
}

export async function create(data: Omit<Interview, 'id' | 'status' | 'createdAt' | 'updatedAt'> & { status?: InterviewStatus }): Promise<Interview> {
  if (MODE !== 'mock') {
    const r = await fetchOrFallback(`${BASE}/api/interviews`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (r && r.ok) {
      try {
        return (await r.json()) as Interview;
      } catch {}
    }
  }
  const list = read();
  const now = new Date().toISOString();
  const interview: Interview = {
    id: String(Date.now()),
    status: data.status || 'proposed',
    createdAt: now,
    updatedAt: now,
    ...data,
  };
  list.push(interview);
  write(list);
  return interview;
}

export async function update(id: string, patch: Partial<Pick<Interview, 'whenISO' | 'durationMins' | 'note' | 'status'>>): Promise<Interview> {
  if (MODE !== 'mock') {
    const r = await fetchOrFallback(`${BASE}/api/interviews/${id}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(patch),
    });
    if (r && r.ok) {
      try {
        return (await r.json()) as Interview;
      } catch {}
    }
  }
  const list = read();
  const idx = list.findIndex((i) => i.id === id);
  if (idx === -1) throw new Error('not_found');
  const updated: Interview = { ...list[idx], ...patch, updatedAt: new Date().toISOString() };
  list[idx] = updated;
  write(list);
  return updated;
}

export function interviewsEnabled() {
  return process.env.NEXT_PUBLIC_ENABLE_INTERVIEWS_UI === 'true';
}

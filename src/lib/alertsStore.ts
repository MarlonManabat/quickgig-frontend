import type { JobAlert } from '@/types/alert';

const KEY = 'alerts:v1';
let mem: JobAlert[] = [];

function read(): JobAlert[] {
  if (typeof window !== 'undefined') {
    try {
      return JSON.parse(localStorage.getItem(KEY) || '[]');
    } catch {
      return [];
    }
  }
  return mem;
}

function write(all: JobAlert[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(KEY, JSON.stringify(all));
  } else {
    mem = all;
  }
}

export function listAlerts(): JobAlert[] {
  return read();
}

export function upsertAlert(a: Omit<JobAlert, 'id' | 'createdAt'> & { id?: string }): JobAlert {
  const all = read();
  const id = a.id || Math.random().toString(36).slice(2);
  const existingIndex = all.findIndex((al) => al.id === id);
  const createdAt = existingIndex !== -1 ? all[existingIndex].createdAt : Date.now();
  const next: JobAlert = { ...all[existingIndex], ...a, id, createdAt } as JobAlert;
  if (existingIndex !== -1) {
    all[existingIndex] = next;
  } else {
    all.push(next);
  }
  write(all);
  return next;
}

export function removeAlert(id: string): void {
  const all = read().filter((a) => a.id !== id);
  write(all);
}

export function findByParams(p: Partial<JobAlert>): JobAlert | undefined {
  const all = read();
  return all.find(
    (a) =>
      (p.q ?? '') === (a.q ?? '') &&
      (p.loc ?? '') === (a.loc ?? '') &&
      (p.cat ?? '') === (a.cat ?? '') &&
      (p.sort ?? '') === (a.sort ?? '') &&
      (p.size ?? 0) === (a.size ?? 0)
  );
}

import type { JobSummary } from '../types/job';

const KEY = 'applied_jobs_v1';

type Entry = { job: JobSummary; appliedAt: string };

function read(): Record<string, Entry> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}');
  } catch {
    return {};
  }
}

function write(map: Record<string, Entry>) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEY, JSON.stringify(map));
  } catch {}
}

export function markApplied(jobId: string, job: JobSummary) {
  if (typeof window === 'undefined') return;
  const map = read();
  map[jobId] = { job, appliedAt: new Date().toISOString() };
  write(map);
}

export function listApplied(): JobSummary[] {
  const map = read();
  return Object.values(map)
    .sort((a, b) => b.appliedAt.localeCompare(a.appliedAt))
    .map((e) => e.job);
}

export function isApplied(jobId: string | number): boolean {
  const map = read();
  return !!map[String(jobId)];
}

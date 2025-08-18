import type { Interview } from '@/types/interviews';

const KEY = 'interviews';
let memory: Record<string, Interview[]> | null = null;

function readMap(): Record<string, Interview[]> {
  if (typeof window !== 'undefined' && window.localStorage) {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Record<string, Interview[]>) : {};
  }
  return memory || {};
}

function writeMap(m: Record<string, Interview[]>) {
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem(KEY, JSON.stringify(m));
  } else {
    memory = m;
  }
}

export { readMap as readInterviews, writeMap as writeInterviews };

import * as React from 'react';
import { track } from '@/lib/analytics';
const KEY = 'qg:savedJobs';
function read(): string[] {
  if (typeof window === 'undefined') return [];
  try { const v = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(v) ? v : []; }
  catch { return []; }
}
function write(ids: string[]) {
  if (typeof window === 'undefined') return;
  try {
    const unique = ids.filter((x, i, arr) => arr.indexOf(x) === i);
    localStorage.setItem(KEY, JSON.stringify(unique));
  } catch {}
}
export function useSavedJobs() {
  const [ids, setIds] = React.useState<string[]>([]);
  React.useEffect(() => { setIds(read()); }, []);
  const isSaved = React.useCallback((id: string) => ids.includes(id), [ids]);
  const toggle = React.useCallback((id: string) => {
    setIds(prev => {
      const next = prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id];
      write(next);
      track(prev.includes(id) ? 'job_unsave' : 'job_save', { id });
      return next;
    });
  }, []);
  return { ids, isSaved, toggle };
}

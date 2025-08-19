import { API } from '@/config/api';
import { env } from '@/config/env';
import { apiGet, apiPost } from './api';

const KEY = 'quickgig_saved_jobs';

export function getSavedIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}

export function isSaved(id: string | number) {
  return getSavedIds().includes(String(id));
}

export function toggleLocal(id: string | number) {
  const ids = new Set(getSavedIds());
  const sid = String(id);
  if (ids.has(sid)) {
    ids.delete(sid);
  } else {
    ids.add(sid);
  }
  if (typeof window !== 'undefined') {
    localStorage.setItem(KEY, JSON.stringify(Array.from(ids)));
  }
  return ids.has(sid);
}

export async function hydrateSavedIds() {
  if (typeof window === 'undefined') return [];
  if (env.NEXT_PUBLIC_ENABLE_SAVED_API) {
    try {
      const ids = await apiGet<string[]>(API.savedList);
      localStorage.setItem(KEY, JSON.stringify(ids));
      return ids;
    } catch {
      return getSavedIds();
    }
  }
  return getSavedIds();
}

export async function toggle(id: string | number) {
  const saved = toggleLocal(id);
  if (env.NEXT_PUBLIC_ENABLE_SAVED_API) {
    try {
      await apiPost(API.savedToggle(id), {});
    } catch {
      // ignore
    }
  }
  return saved;
}

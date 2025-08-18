import type { UserSettings } from '@/types/settings';
import { getPrefs, savePrefs } from './prefs';

const KEY = 'qg:settings';

async function unwrap<T>(res: Response): Promise<T> {
  const json = await res.json().catch(() => ({}));
  return json && typeof json === 'object' && 'data' in json
    ? (json.data as T)
    : (json as T);
}

export async function getSettings(): Promise<UserSettings> {
  const res = await fetch('/api/settings', { credentials: 'include' });
  if (!res.ok) throw new Error('settings');
  const data = await unwrap<UserSettings>(res);
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(data));
    } catch {
      /* ignore */
    }
  }
  return data;
}

export async function updateSettings(patch: Partial<UserSettings>): Promise<UserSettings> {
  const res = await fetch('/api/settings', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
    credentials: 'include',
  });
  if (!res.ok) throw new Error('settings');
  const data = await unwrap<UserSettings>(res);
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(data));
    } catch {
      /* ignore */
    }
    if (patch.language) {
      const prefs = getPrefs();
      savePrefs({ ...prefs, copy: patch.language === 'tl' ? 'taglish' : 'english' });
    }
    if (patch.email?.alertsFrequency && process.env.NEXT_PUBLIC_ENABLE_ALERTS === 'true') {
      fetch('/api/alerts/preferences', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ frequency: patch.email.alertsFrequency }),
      }).catch(() => {
        // eslint-disable-next-line no-console
        console.warn('[alerts] update failed');
      });
    }
  }
  return data;
}


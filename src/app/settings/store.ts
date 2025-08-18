import type { UserSettings, EmailPrefs, AlertsFreq } from '@/types/settings';
import { env } from '@/config/env';
import { engineFetch } from '@/lib/engine';

const KEY = 'settings_v1';

export const defaults: UserSettings = {
  lang: env.NEXT_PUBLIC_DEFAULT_LANG,
  email: env.NEXT_PUBLIC_DEFAULT_EMAIL_PREFS as EmailPrefs,
  alerts: env.NEXT_PUBLIC_DEFAULT_ALERTS_FREQUENCY as AlertsFreq,
  notifyEnabled: true,
};

function mapFromEngine(d: unknown): UserSettings {
  const obj = d as Record<string, unknown>;
  return {
    lang: obj.lang === 'tl' ? 'tl' : 'en',
    email: (obj.email as EmailPrefs) || defaults.email,
    alerts: (obj.alerts as AlertsFreq) || defaults.alerts,
    notifyEnabled: Boolean(
      (obj as { notifyEnabled?: unknown; notify_enabled?: unknown }).notifyEnabled ??
        (obj as { notifyEnabled?: unknown; notify_enabled?: unknown }).notify_enabled ??
        true,
    ),
  };
}

function mapToEngine(patch: Partial<UserSettings>) {
  return patch;
}

export async function getSettings(): Promise<UserSettings> {
  if (process.env.ENGINE_MODE === 'php' && env.NEXT_PUBLIC_ENABLE_SETTINGS) {
    try {
      const res = (await engineFetch('/api/v1/settings')) as Response;
      if (res.ok) {
        const j = await res.json();
        return mapFromEngine(j);
      }
    } catch {
      /* ignore */
    }
  }
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) return { ...defaults, ...JSON.parse(raw) } as UserSettings;
    } catch {
      /* ignore */
    }
  }
  return defaults;
}

export async function saveSettings(patch: Partial<UserSettings>): Promise<UserSettings> {
  if (process.env.ENGINE_MODE === 'php' && env.NEXT_PUBLIC_ENABLE_SETTINGS) {
    try {
      const res = (await engineFetch('/api/v1/settings', {
        method: 'PUT',
        body: JSON.stringify(mapToEngine(patch)),
      })) as Response;
      if (res.ok) {
        const j = await res.json();
        const mapped = mapFromEngine(j);
        if (typeof window !== 'undefined') {
          localStorage.setItem(KEY, JSON.stringify(mapped));
          if (patch.lang)
            localStorage.setItem('copyVariant', patch.lang === 'tl' ? 'taglish' : 'english');
        }
        return mapped;
      }
    } catch {
      /* ignore */
    }
  }
  const cur = await getSettings();
  const next = { ...cur, ...patch } as UserSettings;
  if (typeof window !== 'undefined') {
    localStorage.setItem(KEY, JSON.stringify(next));
    if (patch.lang)
      localStorage.setItem('copyVariant', patch.lang === 'tl' ? 'taglish' : 'english');
  }
  return next;
}

export async function resetSettings() {
  if (process.env.ENGINE_MODE === 'php' && env.NEXT_PUBLIC_ENABLE_SETTINGS) {
    try {
      await engineFetch('/api/v1/settings', { method: 'DELETE' });
    } catch {
      /* ignore */
    }
  }
  if (typeof window !== 'undefined') localStorage.removeItem(KEY);
}

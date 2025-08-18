'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Settings } from '@/types/settings';
import { defaultsFromEnv, mergeSettings } from '@/lib/settings';
import { getPrefs, savePrefs } from '@/lib/prefs';

export function useSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/settings', { credentials: 'include' });
      if (!res.ok) throw new Error('settings');
      const data = (await res.json()) as Settings;
      setSettings(data);
    } catch (err) {
      setError((err as Error).message);
      setSettings(defaultsFromEnv());
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const update = useCallback(
    async (patch: Partial<Settings>) => {
      if (!settings) return;
      const optimistic = mergeSettings(settings, patch);
      setSettings(optimistic);
      setSaving(true);
      try {
        const res = await fetch('/api/settings', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(patch),
        });
        if (res.ok) {
          const data = (await res.json()) as Settings;
          setSettings(data);
          if (patch.lang && patch.lang !== settings.lang) {
            const prefs = getPrefs();
            savePrefs({ ...prefs, copy: patch.lang === 'tl' ? 'taglish' : 'english' });
          }
        } else {
          setSettings(settings); // revert
        }
      } catch {
        setSettings(settings); // revert
      } finally {
        setSaving(false);
      }
    },
    [settings],
  );

  return { settings, update, refresh, saving, error } as const;
}

export function useUserLang() {
  const { settings } = useSettings();
  return settings?.lang || defaultsFromEnv().lang;
}

export function useEmailPrefs() {
  const { settings } = useSettings();
  return settings?.email || defaultsFromEnv().email;
}

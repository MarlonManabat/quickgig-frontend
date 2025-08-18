'use client';

import { useCallback, useEffect, useState } from 'react';
import type { UserSettings } from '@/types/settings';
import { defaults } from '@/app/settings/store';

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [saving, setSaving] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = (await res.json()) as UserSettings;
        setSettings(data);
      } else {
        setSettings(defaults);
      }
    } catch {
      setSettings(defaults);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const update = useCallback(
    async (patch: Partial<UserSettings>) => {
      if (!settings) return;
      const optimistic = { ...settings, ...patch } as UserSettings;
      setSettings(optimistic);
      setSaving(true);
      try {
        const res = await fetch('/api/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(optimistic),
        });
        if (res.ok) {
          const data = (await res.json()) as UserSettings;
          setSettings(data);
          if (patch.lang) {
            document.cookie = `NEXT_LOCALE=${patch.lang}; path=/`;
            if (typeof window !== 'undefined')
              localStorage.setItem(
                'copyVariant',
                patch.lang === 'tl' ? 'taglish' : 'english',
              );
          }
        } else {
          setSettings(settings);
        }
      } catch {
        setSettings(settings);
      } finally {
        setSaving(false);
      }
    },
    [settings],
  );

  return { settings, update, refresh, saving } as const;
}

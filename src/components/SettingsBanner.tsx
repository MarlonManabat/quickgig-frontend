'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { env } from '@/config/env';
import { useSettings } from '@/hooks/useSettings';
import { defaults } from '@/app/settings/store';
import { t } from '@/lib/i18n';

export default function SettingsBanner() {
  const { settings } = useSettings();
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDismissed(localStorage.getItem('settingsBannerDismissed') === '1');
    }
  }, []);

  if (!env.NEXT_PUBLIC_ENABLE_SETTINGS) return null;
  if (dismissed) return null;
  if (!settings) return null;
  if (JSON.stringify(settings) !== JSON.stringify(defaults)) return null;

  const dismiss = () => {
    setDismissed(true);
    if (typeof window !== 'undefined') localStorage.setItem('settingsBannerDismissed', '1');
  };

  return (
    <div className="bg-yellow-100 text-yellow-800 text-center p-2 text-sm">
      <span>{t('settings.banner.prompt')}</span>
      <Link href="/settings" className="underline ml-2">
        {t('settings.title')}
      </Link>
      <button onClick={dismiss} className="ml-4 underline">
        {t('settings.banner.dismiss')}
      </button>
    </div>
  );
}

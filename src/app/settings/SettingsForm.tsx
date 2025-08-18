'use client';

import { useEffect, useState } from 'react';
import type { UserSettings, EmailPrefs, AlertsFreq } from '@/types/settings';
import { useSettings } from '@/hooks/useSettings';
import Button from '@/components/ui/Button';
import { toast } from '@/lib/toast';
import { t } from '@/lib/i18n';

export default function SettingsForm() {
  const { settings, update, saving } = useSettings();
  const [form, setForm] = useState<UserSettings | null>(null);

  useEffect(() => {
    if (settings) setForm(settings);
  }, [settings]);

  if (!form) return <main className="p-4">{t('loading') || 'Loading'}</main>;

  const onChange = (field: keyof UserSettings) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = field === 'notifyEnabled' ? e.target.checked : e.target.value;
    setForm({ ...form, [field]: value });
  };

  const dirty = JSON.stringify(form) !== JSON.stringify(settings);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    await update(form);
    toast(t('settings.toast.saved'));
  };

  return (
    <main className="p-4 space-y-6 max-w-xl">
      <h1 className="text-xl font-semibold">{t('settings.title')}</h1>
      <form onSubmit={onSave} className="space-y-6">
        <section>
          <p className="font-medium mb-2">{t('settings.language.label')}</p>
          <label className="flex items-center gap-2 mb-1">
            <input
              type="radio"
              name="lang"
              value="en"
              checked={form.lang === 'en'}
              onChange={onChange('lang')}
            />
            {t('settings.language.en')}
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="lang"
              value="tl"
              checked={form.lang === 'tl'}
              onChange={onChange('lang')}
            />
            {t('settings.language.tl')}
          </label>
        </section>
        <section>
          <p className="font-medium mb-2">{t('settings.emails.label')}</p>
          {(['ops_only', 'all', 'none'] as EmailPrefs[]).map((k) => (
            <label key={k} className="flex items-center gap-2 mb-1">
              <input
                type="radio"
                name="email"
                value={k}
                checked={form.email === k}
                onChange={onChange('email')}
              />
              {t(`settings.emailPref.${k}`)}
            </label>
          ))}
        </section>
        <section>
          <p className="font-medium mb-2">{t('settings.alerts.label')}</p>
          {(['daily', 'weekly'] as AlertsFreq[]).map((k) => (
            <label key={k} className="flex items-center gap-2 mb-1">
              <input
                type="radio"
                name="alerts"
                value={k}
                checked={form.alerts === k}
                onChange={onChange('alerts')}
                disabled={form.email === 'none'}
              />
              {t(`settings.alerts.${k}`)}
            </label>
          ))}
        </section>
        <section>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.notifyEnabled}
              onChange={onChange('notifyEnabled')}
            />
            {t('settings.notify.label')}
          </label>
        </section>
        <div className="flex items-center gap-2">
          <Button type="submit" disabled={!dirty || saving}>
            {saving ? t('saving') || 'Saving...' : t('settings.save')}
          </Button>
          {dirty && <span className="text-sm text-gray-500">{t('settings.unsaved')}</span>}
        </div>
      </form>
    </main>
  );
}

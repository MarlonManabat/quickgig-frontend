'use client';

import { useEffect, useState } from 'react';
import type { UserSettings } from '@/types/settings';
import { getSettings, updateSettings } from '@/lib/settingsStore';
import { t } from '@/lib/i18n';
import Button from '@/components/ui/Button';
import { toast } from '@/lib/toast';

export default function SettingsForm() {
  const [base, setBase] = useState<UserSettings | null>(null);
  const [form, setForm] = useState<UserSettings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getSettings()
      .then((s) => {
        setBase(s);
        setForm(s);
      })
      .catch(() => {
        /* ignore */
      });
  }, []);

  if (!form) return <main className="p-4">{t('loading') || 'Loading'}</main>;

  const onLang = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, language: e.target.value as 'en' | 'tl' });
  const onEmail = (field: keyof UserSettings['email']) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm({
        ...form,
        email: {
          ...form.email,
          [field]:
            e.target.type === 'checkbox'
              ? (e.target as HTMLInputElement).checked
              : e.target.value,
        },
      });

  const disabled = !form.email.marketingAllowed;

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    try {
      const updated = await updateSettings(form);
      setBase(updated);
      setForm(updated);
      toast(t('settings.toast.saved'));
      if (base && base.language !== updated.language) {
        window.location.reload();
      }
    } catch {
      toast(t('settings.toast.error'));
    } finally {
      setSaving(false);
    }
  };

  const onCancel = () => setForm(base);

  return (
    <main className="p-4 space-y-6 max-w-xl">
      <h1 className="text-xl font-semibold">{t('settings.title')}</h1>
      <form onSubmit={onSave} className="space-y-6">
        <div>
          <p className="font-medium mb-2">{t('settings.language.label')}</p>
          <label className="flex items-center gap-2 mb-1">
            <input
              type="radio"
              name="lang"
              value="en"
              checked={form.language === 'en'}
              onChange={onLang}
            />
            {t('settings.language.en')}
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="lang"
              value="tl"
              checked={form.language === 'tl'}
              onChange={onLang}
            />
            {t('settings.language.tl')}
          </label>
        </div>
        <div>
          <p className="font-medium mb-2">{t('settings.emails.label')}</p>
          <label className="flex items-center gap-2 mb-2">
            <span>{t('settings.emails.alerts.label')}</span>
            <select
              value={form.email.alertsFrequency}
              onChange={onEmail('alertsFrequency')}
              className="border rounded px-1 py-0.5"
            >
              <option value="off">{t('settings.emails.alerts.off')}</option>
              <option value="daily">{t('settings.emails.alerts.daily')}</option>
              <option value="weekly">{t('settings.emails.alerts.weekly')}</option>
            </select>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.email.interviews}
              onChange={onEmail('interviews')}
              disabled={disabled}
            />
            {t('settings.emails.interviews')}
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.email.applications}
              onChange={onEmail('applications')}
              disabled={disabled}
            />
            {t('settings.emails.applications')}
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.email.messages}
              onChange={onEmail('messages')}
              disabled={disabled}
            />
            {t('settings.emails.messages')}
          </label>
          <label className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              checked={form.email.marketingAllowed}
              onChange={onEmail('marketingAllowed')}
            />
            {t('settings.emails.marketingAllowed')}
          </label>
        </div>
        <div className="flex gap-2">
          <Button type="submit" disabled={saving}>
            {saving ? t('saving') || 'Saving...' : t('settings.save')}
          </Button>
          <Button type="button" variant="secondary" onClick={onCancel}>
            {t('settings.cancel')}
          </Button>
        </div>
      </form>
    </main>
  );
}


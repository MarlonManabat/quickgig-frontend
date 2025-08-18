'use client';

import { useEffect, useState } from 'react';
import type { Settings, EmailPref } from '@/types/settings';
import { useSettings } from '@/hooks/useSettings';
import Button from '@/components/ui/Button';
import { toast } from '@/lib/toast';
import { t } from '@/lib/i18n';

export default function SettingsForm() {
  const { settings, update, saving } = useSettings();
  const [form, setForm] = useState<Settings | null>(null);

  useEffect(() => {
    if (settings) setForm(settings);
  }, [settings]);

  if (!form) return <main className="p-4">{t('loading') || 'Loading'}</main>;

  const onLang = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, lang: e.target.value as 'en' | 'tl' });

  const onEmail = (field: keyof Settings['email']) =>
    (e: React.ChangeEvent<HTMLSelectElement>) =>
      setForm({ ...form, email: { ...form.email, [field]: e.target.value as EmailPref } });

  const onNotify = (field: keyof Settings['notify']) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = { ...form, notify: { ...form.notify, [field]: e.target.checked } };
      setForm(next);
      update({ notify: { [field]: e.target.checked } } as Partial<Settings>);
    };

  const dirty = JSON.stringify(form) !== JSON.stringify(settings);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    await update(form);
    toast(t('settings.toast.saved'));
  };

  const logoutAll = async () => {
    await fetch('/api/session/logout-all', { method: 'POST' });
    toast(t('settings.toast.loggedOut'));
  };

  const deleteAccount = async () => {
    if (!confirm(t('settings.confirm.delete'))) return;
    await fetch('/api/account', { method: 'DELETE' });
    toast(t('settings.toast.deleted'));
    window.location.href = '/';
  };

  return (
    <main className="p-4 space-y-6 max-w-xl">
      <h1 className="text-xl font-semibold">{t('settings.title')}</h1>
      <form onSubmit={onSave} className="space-y-6">
        <section>
          <p className="font-medium mb-2">{t('settings.language.label')}</p>
          <label className="flex items-center gap-2 mb-1">
            <input type="radio" name="lang" value="en" checked={form.lang === 'en'} onChange={onLang} />
            {t('settings.language.en')}
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="lang" value="tl" checked={form.lang === 'tl'} onChange={onLang} />
            {t('settings.language.tl')}
          </label>
        </section>
        <section>
          <p className="font-medium mb-2">{t('settings.emails.label')}</p>
          {(['applications','interviews','alerts','admin'] as const).map((k) => (
            <label key={k} className="flex items-center gap-2 mb-2">
              <span className="w-32 capitalize">{t(`settings.emails.${k}`)}</span>
              <select
                value={form.email[k]}
                onChange={onEmail(k)}
                className="border rounded px-1 py-0.5"
              >
                <option value="all">{t('settings.emailPref.all')}</option>
                <option value="ops_only">{t('settings.emailPref.ops')}</option>
                <option value="none">{t('settings.emailPref.none')}</option>
              </select>
            </label>
          ))}
        </section>
        <section>
          <p className="font-medium mb-2">{t('settings.notify.label')}</p>
          {(['message','application','interview','alert','admin'] as const).map((k) => (
            <label key={k} className="flex items-center gap-2 mb-1">
              <input type="checkbox" checked={form.notify[k]} onChange={onNotify(k)} />
              <span className="capitalize">{t(`settings.notify.${k}`)}</span>
            </label>
          ))}
        </section>
        <div className="flex gap-2">
          <Button type="submit" disabled={!dirty || saving}>
            {saving ? t('saving') || 'Saving...' : t('settings.save')}
          </Button>
        </div>
      </form>
      <section>
        <p className="font-medium mb-2">{t('settings.session.label')}</p>
        <Button onClick={logoutAll} variant="secondary">
          {t('settings.session.logoutAll')}
        </Button>
      </section>
      <section>
        <p className="font-medium mb-2 text-red-600">{t('settings.danger.label')}</p>
        <Button onClick={deleteAccount} variant="secondary" className="text-red-600 border-red-600">
          {t('settings.danger.delete')}
        </Button>
      </section>
    </main>
  );
}

import type { Settings, EmailPref } from '@/types/settings';

export function defaultsFromEnv(): Settings {
  const lang = process.env.NEXT_PUBLIC_DEFAULT_LANG === 'tl' ? 'tl' : 'en';
  const pref = (process.env.NEXT_PUBLIC_DEFAULT_EMAIL_PREFS as EmailPref) || 'ops_only';
  const email = {
    applications: pref,
    interviews: pref,
    alerts: pref,
    admin: pref,
  };
  const notify = {
    message: true,
    application: true,
    interview: true,
    alert: true,
    admin: true,
  };
  return { lang, email, notify };
}

export function mergeSettings(base: Settings, patch: Partial<Settings>): Settings {
  return {
    ...base,
    ...patch,
    email: { ...base.email, ...(patch.email || {}) },
    notify: { ...base.notify, ...(patch.notify || {}) },
  };
}

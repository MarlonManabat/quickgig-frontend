import type { UserSettings, EmailPrefs, AlertsFreq } from '@/types/settings';

export function defaultsFromEnv(): UserSettings {
  const lang = process.env.NEXT_PUBLIC_DEFAULT_LANG === 'tl' ? 'tl' : 'en';
  const email = (process.env.NEXT_PUBLIC_DEFAULT_EMAIL_PREFS as EmailPrefs) || 'ops_only';
  const alerts = (process.env.NEXT_PUBLIC_DEFAULT_ALERTS_FREQUENCY as AlertsFreq) || 'weekly';
  return { lang, email, alerts, notifyEnabled: true };
}

export function mergeSettings(base: UserSettings, patch: Partial<UserSettings>): UserSettings {
  return { ...base, ...patch };
}

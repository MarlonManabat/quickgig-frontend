export type EmailPrefs = 'ops_only'|'all'|'none';
export type AlertsFreq = 'daily'|'weekly';
export interface UserSettings { lang:'en'|'tl'; email: EmailPrefs; alerts: AlertsFreq; notifyEnabled: boolean; }

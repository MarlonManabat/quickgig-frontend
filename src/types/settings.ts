export type EmailPrefs = {
  alertsFrequency: 'off' | 'daily' | 'weekly';
  interviews: boolean;
  applications: boolean;
  messages: boolean;
  marketingAllowed: boolean;
};

export type UserSettings = {
  language: 'en' | 'tl';
  email: EmailPrefs;
  updatedAt: string; // ISO
};


export type EmailPrefs = 'alerts_only'|'all'|'none';
export interface UserPrefs {
  copy: 'english'|'taglish';
  emails: EmailPrefs;
  marketing?: boolean; // reserved
}

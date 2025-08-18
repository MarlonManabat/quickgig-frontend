export type EmailPrefs = 'ops_only'|'all'|'none';
export interface UserPrefs {
  copy: 'english'|'taglish';
  emails: EmailPrefs;
  marketing?: boolean; // reserved
}

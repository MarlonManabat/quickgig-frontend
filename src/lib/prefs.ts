import type { UserPrefs } from '@/types/prefs';

const KEY = 'quickgig:prefs';

function defaultPrefs(): UserPrefs {
  return {
    copy: process.env.NEXT_PUBLIC_COPY_VARIANT === 'taglish' ? 'taglish' : 'english',
    emails:
      (process.env.NEXT_PUBLIC_DEFAULT_EMAIL_PREFS as UserPrefs['emails']) ||
      'ops_only',
  };
}

export function getPrefs(): UserPrefs {
  if (typeof window === 'undefined') return defaultPrefs();
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...defaultPrefs(), ...JSON.parse(raw) } as UserPrefs;
  } catch {
    // ignore
  }
  return defaultPrefs();
}

export function savePrefs(p: UserPrefs): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
    localStorage.setItem('copyV', p.copy);
  } catch {
    // ignore
  }
}

export function prefersEmail(
  kind: 'apply' | 'interview' | 'digest' | 'marketing',
): boolean {
  const prefs = getPrefs();
  if (prefs.emails === 'none') return false;
  if (prefs.emails === 'all') return true;
  if (prefs.emails === 'ops_only')
    return kind === 'apply' || kind === 'interview';
  return false;
}

export { KEY };

'use client';
import { useEffect } from 'react';

export default function ClientAuthGuard() {
  useEffect(() => {
    const legacySuffix = '/login' + '.php';
    const legacyFull = 'quickgig.ph' + legacySuffix;

    const onSubmit = (e: Event) => {
      const t = e.target as HTMLFormElement | null;
      if (!t || t.tagName !== 'FORM') return;
      const action = (t.getAttribute('action') || '').toLowerCase();
      if (action.includes(legacyFull) || action.endsWith(legacySuffix)) {
        console.warn('[auth-guard] rewrite form action -> /api/session/login');
        t.setAttribute('action', '/api/session/login');
        t.setAttribute('method', 'post');
      }
    };
    const onClick = (e: Event) => {
      const a = (e.target as HTMLElement).closest('a') as HTMLAnchorElement | null;
      if (!a) return;
      const href = (a.getAttribute('href') || '').toLowerCase();
      if (href.includes(legacyFull) || href.endsWith(legacySuffix)) {
        console.warn('[auth-guard] rewrite anchor -> /login');
        e.preventDefault();
        location.assign('/login');
      }
    };
    document.addEventListener('submit', onSubmit, true);
    document.addEventListener('click', onClick, true);
    return () => {
      document.removeEventListener('submit', onSubmit, true);
      document.removeEventListener('click', onClick, true);
    };
  }, []);
  return null;
}

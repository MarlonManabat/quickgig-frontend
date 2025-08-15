'use client';
import { useEffect } from 'react';

export default function ClientAuthGuard() {
  useEffect(() => {
    const onSubmit = (e: Event) => {
      const t = e.target as HTMLFormElement | null;
      if (t && t.tagName === 'FORM') {
        const action = (t.getAttribute('action') || '').toLowerCase();
        if (action.includes('quickgig.ph/login.php') || action.endsWith('/login.php')) {
          console.warn('[auth-guard] blocked form action -> rewriting to /api/session/login');
          e.preventDefault();
          (t as HTMLFormElement & { __forceSameOrigin?: boolean }).__forceSameOrigin = true;
        }
      }
    };
    const onClick = (e: Event) => {
      const a = (e.target as HTMLElement).closest('a') as HTMLAnchorElement | null;
      if (!a) return;
      const href = (a.getAttribute('href') || '').toLowerCase();
      if (href.includes('quickgig.ph/login.php') || href.endsWith('/login.php')) {
        console.warn('[auth-guard] blocked anchor -> routing to /login');
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

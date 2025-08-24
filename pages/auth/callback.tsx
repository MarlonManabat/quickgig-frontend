import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';

export default function AuthCallback() {
  const supabase = useRef(createBrowserSupabaseClient()).current;
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      const code = (router.query.code as string) || '';
      if (!code) { router.replace('/'); return; }
      const k = `auth:code:${code}`;
      const seen = localStorage.getItem(k);
      if (!seen) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) console.error(error);
        localStorage.setItem(k, String(Date.now()));
        setTimeout(() => localStorage.removeItem(k), 5 * 60 * 1000);
      }
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace('/'); return; }

      const params = new URLSearchParams(window.location.search);
      const next = params.get('next') || '/profile';
      const role = params.get('role') as 'worker' | 'employer' | null;
      if (role) {
        await fetch('/api/profile/set-role-pref', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role }),
        }).catch(() => {});
      }
      router.replace(next);
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.code]);

  return null;
}

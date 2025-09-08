'use client';
import { useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { ROUTES } from '@/app/lib/routes';

export default function ClientLogout() {
  useEffect(() => {
    (async () => {
      try {
        // Best-effort: sign out via Supabase client so any local session is invalidated
        const supabase = createClientComponentClient();
        await supabase.auth.signOut();
      } catch {}
      try {
        // Belt-and-suspenders: remove any sb-* tokens left in localStorage
        for (const k of Object.keys(localStorage)) {
          if (k.startsWith('sb-')) localStorage.removeItem(k);
        }
      } catch {}
      // Go home when done
      window.location.replace(ROUTES.HOME);
    })();
  }, []);
  return (
    <div className="p-6 text-sm text-neutral-600">
      Signing you out…
    </div>
  );
}

'use client';
import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase/browser';

export function useUser() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<null | { id: string; email?: string }>(null);

  useEffect(() => {
    let mounted = true;
    supabaseBrowser.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      const u = data.user ? { id: data.user.id, email: data.user.email ?? undefined } : null;
      setUser(u); setLoading(false);
    });
    const { data: sub } = supabaseBrowser.auth.onAuthStateChange((_e, s) => {
      const u = s?.user ? { id: s.user.id, email: s.user.email ?? undefined } : null;
      setUser(u);
    });
    return () => { mounted = false; sub?.subscription.unsubscribe(); };
  }, []);

  return { user, loading, signOut: () => supabaseBrowser.auth.signOut() };
}

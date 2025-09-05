'use client';
import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase/browser';

export function useUser() {
  const supabase = supabaseBrowser();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<null | { id: string; email?: string }>(null);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      const u = data.user ? { id: data.user.id, email: data.user.email ?? undefined } : null;
      setUser(u); setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      const u = s?.user ? { id: s.user.id, email: s.user.email ?? undefined } : null;
      setUser(u);
    });
    return () => { mounted = false; sub?.subscription.unsubscribe(); };
  }, [supabase.auth]);

  return { user, loading, signOut: () => supabase.auth.signOut() };
}

'use client';
import { useEffect, useState } from 'react';
import { getSupabaseBrowser } from '@/lib/supabase/client';

export function useUser() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<null | { id: string; email?: string }>(null);

  const supabase = getSupabaseBrowser();

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
  }, []);

  return { user, loading, signOut: () => supabase.auth.signOut() };
}

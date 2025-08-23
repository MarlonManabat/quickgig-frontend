'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/utils/supabaseClient';
import Banner from '@/components/ui/Banner';

export default function AuthCallback() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const { code, next } = router.query as { code?: string; next?: string };
    if (!code) return;
    (async () => {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      if (error || !data.session) {
        setError('Hindi valid ang login—paki-check ang email mo.');
        return;
      }
      const user = data.session.user;
      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();
      await supabase.from('profiles').upsert(
        {
          id: user.id,
          full_name: '',
          role: 'user',
          can_post_job: false,
          is_admin: false,
        },
        { onConflict: 'id', ignoreDuplicates: true }
      );
      const dest = existing ? next || '/find-work' : '/profile';
      router.replace(Array.isArray(dest) ? dest[0] : dest);
    })();
  }, [router]);

  if (error) return <Banner kind="error">{error}</Banner>;
  return <p>Loading...</p>;
}

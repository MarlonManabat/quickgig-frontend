'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/utils/supabaseClient';
import { toast } from '@/utils/toast';

export default function AuthCallback() {
  const [msg, setMsg] = useState('Signing you in…');
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get('code');
        const err = url.searchParams.get('error_description');
        if (err) throw new Error(decodeURIComponent(err));

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
        } else {
          // Optional fallback for legacy hash links
          // const { data, error } = await supabase.auth.getSessionFromUrl({ storeSession: true });
          // if (error) throw error;
        }

        const {
          data: { user },
          error: userErr,
        } = await supabase.auth.getUser();
        if (userErr) throw userErr;
        if (!user) throw new Error('No user after callback');

        const fullName =
          (user.user_metadata &&
            (user.user_metadata.full_name || user.user_metadata.name)) ||
          user.email?.split('@')[0] ||
          'User';

        const { data: existing } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle();

        const updates: any = { id: user.id, full_name: fullName };
        if (!existing || !existing.role) updates.role = 'user';
        const { error: upErr } = await supabase
          .from('profiles')
          .upsert(updates, { onConflict: 'id' });
        if (upErr) throw upErr;

        const dest =
          localStorage.getItem('postAuthRedirect') || '/profile';
        localStorage.removeItem('postAuthRedirect');
        router.replace(dest);
      } catch (e: any) {
        console.error(e);
        setMsg(`Login failed: ${e.message || e}`);
        toast.error(e.message || 'Login failed');
      }
    };
    run();
  }, [router]);

  return <p style={{ padding: 24 }}>{msg}</p>;
}

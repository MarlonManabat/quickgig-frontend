import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { hasMockSession } from '@/lib/session';

export default function Start() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    (async () => {
      const intentParam = (router.query.intent as string) || 'worker';
      const intent = intentParam === 'employer' ? 'employer' : 'worker';
      const target = intent === 'worker' ? '/find' : '/post';

      // who am i?
      const { data: { user } } = await supabase.auth.getUser();

      // not authed → go login, then back here (unless mock session)
      if (!user && !hasMockSession()) {
        const next = encodeURIComponent(`/start?intent=${intent}`);
        router.replace(`/login?next=${next}`);
        return;
      }

      if (hasMockSession()) {
        router.replace(`/profile?next=${encodeURIComponent(target)}`);
        return;
      }

      // fetch profile for role_pref + completeness
      const { data: profile } = await supabase
        .from('profiles')
        .select('role_pref, first_name, city')
        .eq('id', user.id)
        .maybeSingle();

      // set role_pref if missing and intent is known (fire and forget)
      if (!profile?.role_pref) {
        await supabase.from('profiles').update({ role_pref: intent }).eq('id', user.id);
      }

      const incomplete = !profile || !profile.first_name || !profile.city;
      if (incomplete) {
        const next = encodeURIComponent(target);
        router.replace(`/profile?next=${next}`);
        return;
      }

      // all good → go straight to target
      router.replace(target);
    })();
  }, [router]);

  return (
    <main className="mx-auto max-w-md p-6">
      <p>Setting things up…</p>
    </main>
  );
}

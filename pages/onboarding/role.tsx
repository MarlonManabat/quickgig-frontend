import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { getRolePref, setRolePref, type RolePref } from '@/lib/rolePref';

export default function RolePick() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace('/login');
        return;
      }
      setUid(user.id);
      const existing = await getRolePref(user.id);
      if (existing) {
        router.replace(existing === 'worker' ? '/find' : '/post');
      }
    })();
  }, []);

  async function choose(value: RolePref) {
    await setRolePref(value, uid ?? undefined);
    router.replace(value === 'worker' ? '/find' : '/post');
  }

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">How do you want to use QuickGig?</h1>
      <p className="text-gray-600">Pick one to personalize your experience. You can change later.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button onClick={() => choose('worker')} className="qg-btn qg-btn--primary px-4 py-6 rounded-xl text-left">
          I’m looking for work
          <div className="text-sm text-gray-800 mt-1">Browse jobs and apply quickly.</div>
        </button>
        <button onClick={() => choose('employer')} className="qg-btn qg-btn--white px-4 py-6 rounded-xl text-left">
          I’m hiring
          <div className="text-sm text-gray-600 mt-1">Post a job and manage applicants.</div>
        </button>
      </div>
      <button onClick={() => router.replace('/home')} className="qg-link text-sm">Skip for now</button>
    </main>
  );
}

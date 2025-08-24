import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function ProfilePage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [profile, setProfile] = useState({ first_name: '', city: '', avatar_url: '' });
  const [role, setRole] = useState<'worker' | 'employer' | 'unknown'>('unknown');

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace('/login?next=/profile'); return; }
      const { data } = await supabase
        .from('profiles')
        .select('first_name, city, avatar_url, role_pref')
        .eq('id', user.id)
        .maybeSingle();
      if (data) {
        setProfile({
          first_name: data.first_name || '',
          city: data.city || '',
          avatar_url: data.avatar_url || '',
        });
        setRole((data.role_pref ?? 'unknown') as any);
      }
    })();
  }, [router, supabase]);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase
      .from('profiles')
      .update({
        first_name: profile.first_name,
        city: profile.city,
        avatar_url: profile.avatar_url,
      })
      .eq('id', user.id);
    if (role === 'worker') router.replace('/find');
    else if (role === 'employer') router.replace('/post');
    else router.replace('/home');
  }

  return (
    <main className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Complete your profile</h1>
      <form onSubmit={onSave} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">First Name</label>
          <input
            className="w-full border rounded p-2"
            value={profile.first_name}
            onChange={e => setProfile({ ...profile, first_name: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">City</label>
          <input
            className="w-full border rounded p-2"
            value={profile.city}
            onChange={e => setProfile({ ...profile, city: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Avatar URL</label>
          <input
            className="w-full border rounded p-2"
            value={profile.avatar_url}
            onChange={e => setProfile({ ...profile, avatar_url: e.target.value })}
            required
          />
        </div>
        <button className="qg-btn qg-btn--primary px-4 py-2">Save</button>
      </form>
    </main>
  );
}

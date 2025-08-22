'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/utils/supabaseClient';
import Banner from '@/components/Banner';
import Spinner from '@/components/Spinner';
import { getProfile, getUserId } from '@/utils/session';
import { isAccessDenied } from '@/utils/errors';

export default function ProfilePage() {
  const router = useRouter();
  const onboarding = router.query.onboarding === '1';
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [canPostJob, setCanPostJob] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const profile = await getProfile();
      if (profile) {
        setFullName(profile.full_name ?? '');
        setAvatarUrl(profile.avatar_url ?? '');
        setCanPostJob(profile.can_post_job ?? false);
      }
      setLoaded(true);
    })();
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    setError(null);
    const id = await getUserId();
    if (!id) {
      setError("You don't have access to this profile.");
      setSaving(false);
      return;
    }
    const { error } = await supabase
      .from('profiles')
      .upsert({ id, full_name: fullName, avatar_url: avatarUrl });
    if (error) {
      if (isAccessDenied(error)) setError("You don't have access to this profile.");
      else setError(error.message);
      setSaving(false);
      return;
    }
    setStatus('Saved!');
    setSaving(false);
    setTimeout(() => {
      if (onboarding) {
        const dest = canPostJob
          ? '/gigs/new?banner=Let%27s%20post%20your%20first%20job'
          : '/gigs?banner=Profile%20complete%20—%20start%20exploring%20gigs';
        router.replace(dest);
      }
    }, 2000);
  }

  if (!loaded) return <p>Loading...</p>;

  return (
    <div>
      {onboarding && <p className="text-sm mb-4">Step 1 of 2 — Complete your profile</p>}
      {status && <Banner kind="success">{status}</Banner>}
      {error && <Banner kind="error">{error}</Banner>}
      <div className="max-w-md rounded-md border p-4">
        <h1 className="text-3xl font-bold mb-4">Your Profile</h1>
        <form onSubmit={save}>
          <label htmlFor="fullName" className="block">Full name</label>
          <input
            id="fullName"
            className="w-full border rounded-md px-3 py-2 mb-3"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <label htmlFor="avatar" className="block">Avatar URL</label>
          <input
            id="avatar"
            className="w-full border rounded-md px-3 py-2 mb-3"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
          />
          <button
            type="submit"
            className="inline-flex items-center rounded-md bg-black text-white px-4 py-2 hover:opacity-90"
            disabled={saving}
          >
            {saving ? <Spinner /> : 'Save'}
          </button>
        </form>
      </div>
    </div>
  );
}

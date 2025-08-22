'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/utils/supabaseClient';
import Banner from '@/components/ui/Banner';
import Spinner from '@/components/ui/Spinner';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
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
    <div className="space-y-4">
      <p className="text-sm text-brand-subtle">Profile</p>
      {onboarding && <Banner kind="info">Step 1 of 2 — Complete your profile</Banner>}
      {status && <Banner kind="success">{status}</Banner>}
      {error && <Banner kind="error">{error}</Banner>}
      <Card className="max-w-md p-6">
        <h1 className="mb-4">Your Profile</h1>
        <form onSubmit={save} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="label">Full name</label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="avatar" className="label">Avatar URL</label>
            <Input
              id="avatar"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={saving} aria-busy={saving}>
            {saving ? <Spinner /> : 'Save'}
          </Button>
        </form>
      </Card>
    </div>
  );
}

'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/utils/supabaseClient';
import Banner from '@/components/ui/Banner';
import Spinner from '@/components/ui/Spinner';
import { copy } from '@/copy';
import { uploadImage } from '@/utils/uploadImage';
import { isAccessDenied } from '@/utils/errors';

export default function ProfilePage() {
  const router = useRouter();
  const onboarding = router.query.onboarding === '1';
  const [fullName, setFullName] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>();
  const [canPostJob, setCanPostJob] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      setUser(u.user);
      if (u.user) {
        const { data: p } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', u.user.id)
          .single();
        setProfile(p);
        if (p) {
          setFullName(p.full_name ?? '');
          setPreview(p.avatar_url ?? undefined);
          setCanPostJob(p.can_post_job ?? false);
        }
      }
      setLoaded(true);
    })();
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    setError(null);
    const { data: u } = await supabase.auth.getUser();
    const uid = u?.user?.id;
    if (!uid) {
      setError(copy.profile.noAccess);
      setSaving(false);
      return;
    }
    try {
      if (avatar) {
        const up = await uploadImage('avatars', uid, avatar);
        await supabase.from('profiles').update({ avatar_url: up.publicUrl }).eq('id', uid);
      }
      const { error } = await supabase
        .from('profiles')
        .upsert({ id: uid, full_name: fullName });
      if (error) {
        if (isAccessDenied(error)) setError(copy.profile.noAccess);
        else setError(error.message);
        setSaving(false);
        return;
      }
    } catch (err: any) {
      setError(err.message);
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

  const noAccess = !!(user && profile && profile.id !== user.id);

  return (
    <main className="max-w-xl w-full mx-auto px-4 py-8 space-y-4">
      {onboarding && <p className="text-sm text-brand-subtle">{copy.profile.step}</p>}
      {noAccess && (
        <div className="text-red-600 text-sm border rounded px-3 py-2">
          {copy.profile.noAccess}
        </div>
      )}
      {status && <Banner kind="success">{status}</Banner>}
      {error && <Banner kind="error">{error}</Banner>}
      <h1 className="text-2xl font-semibold mb-4">{copy.profile.heading}</h1>
      <form onSubmit={save} className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium">{copy.profile.fullName}</label>
          <input
            id="fullName"
            type="text"
            className="w-full"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">{copy.profile.photoLabel}</label>
          {preview && (
            <img src={preview} alt="Preview" className="h-20 w-20 rounded-full border" />
          )}
          <input
            data-testid="profile-avatar-upload"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0] || null;
              setAvatar(f);
              setPreview(f ? URL.createObjectURL(f) : preview);
            }}
          />
          <p className="text-xs text-gray-500">{copy.profile.photoHelp}</p>
        </div>
        <button
          data-testid="profile-save"
          type="submit"
          disabled={saving}
          aria-busy={saving}
          className="btn-primary px-4 py-2 rounded"
        >
          {saving ? <Spinner /> : copy.profile.save}
        </button>
      </form>
    </main>
  );
}

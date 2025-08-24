import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';
import { uploadAvatar } from '@/lib/avatar';

export default function AvatarUploader() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', user.id)
        .maybeSingle();
      setAvatarUrl(data?.avatar_url ?? null);
    })();
  }, []);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      const url = await uploadAvatar(f);
      setAvatarUrl(url);
    } catch (err) {
      console.error(err);
      alert('Failed to upload avatar.');
    } finally {
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  return (
    <div className="relative h-14 w-14 rounded-full overflow-hidden bg-gray-100">
      {avatarUrl ? (
        <Image src={avatarUrl} alt="Profile photo" fill sizes="56px" />
      ) : (
        <div className="h-full w-full grid place-items-center text-gray-400">Add photo</div>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="absolute inset-0 opacity-0 cursor-pointer"
        onChange={onPick}
      />
    </div>
  );
}

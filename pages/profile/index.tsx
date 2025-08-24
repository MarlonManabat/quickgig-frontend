import ProfileForm from '@/components/forms/ProfileForm'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { supabase } from '@/utils/supabaseClient'

export default function ProfilePage() {
  const [avatar, setAvatar] = useState<string | null>(null)
  const [bio, setBio] = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from('profiles')
      .select('avatar_url,bio')
      .single()
      .then(({ data }) => {
        setAvatar(data?.avatar_url || null)
        setBio(data?.bio || null)
      })
  }, [])

  return (
    <main className="max-w-xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-4">
        {avatar && (
          <Image
            src={avatar}
            alt="Profile avatar"
            width={64}
            height={64}
            className="rounded-full"
          />
        )}
        <div>
          <h1 className="text-2xl font-semibold">Complete your profile</h1>
          {bio && <p className="text-sm text-gray-600 max-w-md">{bio}</p>}
        </div>
      </div>
      <ProfileForm />
    </main>
  )
}

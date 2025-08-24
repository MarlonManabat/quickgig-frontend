import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/utils/supabaseClient'
import type { Session } from '@supabase/supabase-js'
import { copy } from '@/copy'

export default function Nav() {
  const [session, setSession] = useState<Session | null>(null)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setSession(session))
    return () => { listener.subscription.unsubscribe() }
  }, [])

  async function logout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <nav className="p-4 border-b mb-4 flex gap-4">
      <Link href="/home">Home</Link>
      <Link href="/find">{copy.nav.findWork}</Link>
      <Link href="/post">{copy.nav.postJob}</Link>
      {session ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <Link href="/auth">{copy.nav.auth}</Link>
      )}
    </nav>
  )
}

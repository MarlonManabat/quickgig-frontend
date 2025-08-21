'use client'
import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import { useRouter } from 'next/navigation'

export function useRequireAuth(redirectTo: string = '/login') {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<null | { id: string }>(null)

  useEffect(() => {
    let ignore = false
    supabase.auth.getUser().then(({ data }) => {
      if (!ignore) {
        const u = data.user ? { id: data.user.id } : null
        setUser(u)
        if (!u) router.replace(redirectTo)
        setLoading(false)
      }
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      const u = session?.user ? { id: session.user.id } : null
      setUser(u)
      if (!u) router.replace(redirectTo)
    })
    return () => { ignore = true; sub.subscription.unsubscribe() }
  }, [router, redirectTo])

  return { user, loading }
}

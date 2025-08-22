import { ReactNode, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/utils/supabaseClient'

export default function Protected({ children }: { children: ReactNode }) {
  const [allowed, setAllowed] = useState(false)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.replace('/auth')
      else setAllowed(true)
    })
  }, [router])

  if (!allowed) return null
  return <>{children}</>
}

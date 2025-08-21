'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function Page() {
  const urlEnv = process.env.NEXT_PUBLIC_SUPABASE_URL ? 'present' : 'absent'
  const anonEnv = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'present' : 'absent'
  const [status, setStatus] = useState<'loading' | 'ok' | string>('loading')

  useEffect(() => {
    supabase.from('gigs').select('id').limit(1).then(({ error }) => {
      setStatus(error ? error.message : 'ok')
    })
  }, [])

  return (
    <div className="p-6 space-y-2">
      <div>URL env: {urlEnv}</div>
      <div>Anon key env: {anonEnv}</div>
      <div>DB query: {status === 'ok' ? 'OK' : status}</div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/utils/supabaseClient'
import FormShell from '@/components/FormShell'
import EmailField from '@/components/fields/EmailField'
import { copy } from '@/copy'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function check() {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        const { data } = await supabase.from('profiles').select('id').eq('id', session.user.id).maybeSingle()
        router.replace(data ? '/post-job' : '/profile')
      }
    }
    check()
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      if (session) check()
    })
    return () => { sub.subscription.unsubscribe() }
  }, [router])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMsg(null)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/login` },
    })
    setMsg(error ? error.message : 'Check your email to confirm your account.')
  }

  return (
    <FormShell title={copy.auth.signupTitle}>
      <form onSubmit={onSubmit} className="space-y-3">
        <EmailField
          required
          label={copy.auth.email}
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <button className="btn-primary w-full" type="submit">Send Magic Link</button>
        {msg && <p className="text-sm text-brand-subtle">{msg}</p>}
      </form>
    </FormShell>
  )
}

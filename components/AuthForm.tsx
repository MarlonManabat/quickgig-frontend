'use client'
import { useState } from 'react'
import { supabase } from '@/utils/supabaseClient'

export default function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setMsg(null)
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        const { data: { user } } = await supabase.auth.getUser()
        if (user) await fetch('/api/profile', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ full_name: fullName })
        })
        setMsg('Check your email to confirm your account.')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        window.location.href = '/dashboard'
      }
    } catch (err: any) {
      setMsg(err.message ?? 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-sm space-y-3">
      {mode==='signup' && (
        <input required className="w-full border p-2 rounded" placeholder="Full name" value={fullName} onChange={e=>setFullName(e.target.value)} />
      )}
      <input required type="email" className="w-full border p-2 rounded" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input required type="password" className="w-full border p-2 rounded" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button disabled={loading} className="w-full bg-yellow-400 font-bold rounded p-2">{loading?'Please wait…': mode==='signup'?'Create account':'Login'}</button>
      {msg && <p className="text-sm text-red-600">{msg}</p>}
    </form>
  )
}

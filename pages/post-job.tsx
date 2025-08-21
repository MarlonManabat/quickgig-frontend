import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Protected from '@/components/Protected'
import { useRouter } from 'next/router'

function PostJobForm() {
  const [form, setForm] = useState({ title: '', description: '', city: '', budget: '' })
  const [msg, setMsg] = useState<string | null>(null)
  const router = useRouter()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMsg(null)
    if (!form.title || !form.description || !form.city || !form.budget) {
      setMsg('All fields required')
      return
    }
    const { data: { session } } = await supabase.auth.getSession()
    const res = await fetch('/api/gigs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify({ ...form, budget: Number(form.budget) }),
    })
    if (res.ok) {
      const { gig } = await res.json()
      alert('Gig posted')
      router.push(`/gigs/${gig.id}`)
    } else {
      const err = await res.json()
      setMsg(err.error || 'Error')
    }
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="mb-4 text-xl">Post a Job</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full border p-2" placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
        <textarea className="w-full border p-2" placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        <input className="w-full border p-2" placeholder="City" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
        <input className="w-full border p-2" placeholder="Budget" type="number" value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })} />
        <button className="w-full bg-green-600 text-white p-2" type="submit">Post</button>
        {msg && <p className="text-sm">{msg}</p>}
      </form>
    </div>
  )
}

export default function PostJob() {
  return (
    <Protected>
      <PostJobForm />
    </Protected>
  )
}

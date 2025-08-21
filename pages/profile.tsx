import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Protected from '@/components/Protected'
import { useRouter } from 'next/router'

function ProfileForm() {
  const [form, setForm] = useState({ full_name: '', city: '', skills: '', role: 'seeker' })
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()
        if (data) setForm({
          full_name: data.full_name ?? '',
          city: data.city ?? '',
          skills: data.skills ?? '',
          role: data.role ?? 'seeker',
        })
      }
      setLoading(false)
    }
    load()
  }, [])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { error } = await supabase.from('profiles').upsert({ id: user.id, ...form })
    if (error) alert(error.message)
    else {
      alert('Profile saved')
      router.push('/post-job')
    }
  }

  if (loading) return null

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="mb-4 text-xl">Your Profile</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full border p-2" placeholder="Full name" value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} />
        <input className="w-full border p-2" placeholder="City" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
        <input className="w-full border p-2" placeholder="Skills" value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })} />
        <select className="w-full border p-2" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
          <option value="seeker">Seeker</option>
          <option value="client">Client</option>
        </select>
        <button className="w-full bg-blue-500 text-white p-2" type="submit">Save</button>
      </form>
    </div>
  )
}

export default function Profile() {
  return (
    <Protected>
      <ProfileForm />
    </Protected>
  )
}

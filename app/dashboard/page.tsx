'use client'
import { useRequireAuth } from '@/lib/useRequireAuth'
import { getMyProfile, upsertMyProfile } from '@/lib/profile'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function Page(){
  const { user, loading } = useRequireAuth('/login')
  const [profile, setProfile] = useState<any>(null)
  const [fullName, setFullName] = useState('')
  useEffect(()=>{ getMyProfile().then(p=>{ setProfile(p); setFullName(p?.full_name ?? '') }) },[])
  if (loading) return <div className="p-6">Loading…</div>
  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="space-y-2">
        <label className="block text-sm">Full name</label>
        <input className="border p-2 rounded w-full" value={fullName} onChange={e=>setFullName(e.target.value)} />
        <button className="bg-yellow-400 px-4 py-2 rounded font-bold" onClick={async()=>{ await upsertMyProfile({ full_name: fullName }); alert('Saved') }}>Save</button>
      </div>
      <button className="text-sm underline" onClick={async()=>{ await supabase.auth.signOut(); window.location.href='/'; }}>Sign out</button>
    </div>
  )
}

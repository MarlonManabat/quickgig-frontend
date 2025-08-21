'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'

export default function Page(){
  const [rows, setRows] = useState<any[]>([])
  useEffect(()=>{ supabase.from('gigs').select('*').order('created_at', { ascending:false }).limit(50).then(({data})=>setRows(data||[])) },[])
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Gigs</h1>
        <Link className="bg-yellow-400 px-3 py-2 rounded font-bold" href="/gigs/new">Post a Gig</Link>
      </div>
      <ul className="space-y-3">
        {rows.map(r=>(
          <li key={r.id} className="border rounded p-3">
            <Link href={`/gigs/${r.id}`} className="font-semibold">{r.title}</Link>
            <div className="text-sm opacity-80">{r.city} • ₱{r.budget ?? '—'}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}

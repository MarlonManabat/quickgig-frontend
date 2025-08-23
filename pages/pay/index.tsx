import { useState, useEffect } from 'react'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'

export default function PayPage(){
  const supabase = createBrowserSupabaseClient()
  const [file, setFile] = useState<File|null>(null)
  const [rows, setRows] = useState<any[]>([])

  const load = async ()=>{
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase.from('payment_proofs').select('*').eq('user_id', user.id).order('created_at', { ascending:false })
    setRows(data||[])
  }
  useEffect(()=>{ load() },[])

  const submit = async (e:any)=>{
    e.preventDefault()
    if (!file) return alert('Choose a file (PNG/JPG \u22642MB)')
    if (!['image/png','image/jpeg'].includes(file.type)) return alert('PNG/JPG only')
    if (file.size > 2_000_000) return alert('Max 2MB')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const ext = file.type==='image/png'?'png':'jpg'
    const path = `${user.id}/${Date.now()}.${ext}`
    const up = await supabase.storage.from('payment-proofs').upload(path, file, { upsert:true, contentType:file.type })
    if (up.error) return alert(up.error.message)
    const res = await fetch('/api/payments/submit', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ file_path: path }) })
    if (!res.ok) return alert('Submit failed')
    setFile(null); await load(); alert('Uploaded. Awaiting review.')
  }

  return (
    <main className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Upload payment proof</h1>
      <form onSubmit={submit} className="space-y-3">
        <input type="file" accept="image/png,image/jpeg" onChange={e=>setFile(e.target.files?.[0]||null)} />
        <button className="px-4 py-2 rounded bg-black text-white">Submit</button>
      </form>
      <section>
        <h2 className="font-medium mb-2">Your submissions</h2>
        <ul className="space-y-2">
          {rows.map(r=>(
            <li key={r.id} className="border rounded p-3 flex items-center justify-between">
              <span className="text-sm">{r.file_path}</span>
              <span className="text-xs uppercase">{r.status}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}

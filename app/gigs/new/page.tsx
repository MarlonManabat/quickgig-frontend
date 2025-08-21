'use client'
import { useRequireAuth } from '@/lib/useRequireAuth'
import { supabase } from '@/lib/supabaseClient'
import { uploadUserFile } from '@/lib/storage'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Page(){
  useRequireAuth('/login')
  const r = useRouter()
  const [title,setTitle]=useState('')
  const [desc,setDesc]=useState('')
  const [budget,setBudget]=useState<number|''>('')
  const [city,setCity]=useState('')
  const [imageUrl,setImageUrl]=useState<string>('')

  async function submit(e:React.FormEvent){
    e.preventDefault()
    const { data: { user } } = await supabase.auth.getUser()
    if(!user) return
    const { data, error } = await supabase.from('gigs').insert({ owner: user.id, title, description: desc, budget: budget||null, city, image_url: imageUrl }).select().single()
    if (error) alert(error.message)
    else r.push(`/gigs/${data.id}`)
  }

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>){
    const f = e.target.files?.[0]; if(!f) return
    const url = await uploadUserFile(f)
    setImageUrl(url)
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Post a Gig</h1>
      <form onSubmit={submit} className="space-y-3">
        <input required className="border p-2 rounded w-full" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)}/>
        <textarea className="border p-2 rounded w-full" placeholder="Description" value={desc} onChange={e=>setDesc(e.target.value)}/>
        <input className="border p-2 rounded w-full" placeholder="City" value={city} onChange={e=>setCity(e.target.value)}/>
        <input className="border p-2 rounded w-full" type="number" placeholder="Budget (₱)" value={budget} onChange={e=>setBudget(e.target.value===''?'':Number(e.target.value))}/>
        <input type="file" accept="image/*" onChange={onFileChange}/>
        {imageUrl && <img src={imageUrl} alt="" className="h-24 rounded border" />}
        <button className="bg-yellow-400 px-4 py-2 rounded font-bold">Create</button>
      </form>
    </div>
  )
}

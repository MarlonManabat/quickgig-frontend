import { supabase } from '@/lib/supabaseClient'

export default async function Page({ params }: { params: { id: string } }){
  const { data } = await supabase.from('gigs').select('*').eq('id', params.id).single()
  if (!data) return <div className="p-6">Not found</div>
  return (
    <div className="p-6 max-w-3xl mx-auto space-y-3">
      <h1 className="text-2xl font-bold">{data.title}</h1>
      {data.image_url && <img src={data.image_url} alt="" className="rounded border"/>}
      <div className="opacity-80">₱{data.budget ?? '—'} • {data.city ?? ''}</div>
      <p>{data.description}</p>
    </div>
  )
}

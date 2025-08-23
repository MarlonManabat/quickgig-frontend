import { GetServerSideProps } from 'next'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const guard = await requireAdmin(ctx)
  // @ts-ignore
  if (guard.redirect) return guard
  const supabase = createServerSupabaseClient(ctx)
  const { data } = await supabase.from('admin_payment_pending').select('*').order('created_at', { ascending:false })
  return { props: { initial:data||[] } }
}

export default function AdminPayments({ initial=[] as any[] }){
  const approve = async (id:number)=>{ await fetch('/api/admin/payment-proofs/set-status',{method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ id, status:'approved' })}); location.reload() }
  const flag = async (id:number)=>{ await fetch('/api/admin/payment-proofs/set-status',{method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ id, status:'flagged' })}); location.reload() }
  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Pending payment proofs</h1>
      <ul className="space-y-3">
        {initial.map((r:any)=>(
          <li key={r.id} className="border rounded p-3">
            <div className="text-sm">User: {r.user_email || r.user_id}</div>
            <div className="text-xs text-gray-500 mb-2">Path: {r.file_path}</div>
            <div className="flex gap-2">
              <button onClick={()=>approve(r.id)} className="px-3 py-1 rounded bg-green-600 text-white">Approve</button>
              <button onClick={()=>flag(r.id)} className="px-3 py-1 rounded bg-red-600 text-white">Flag</button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  )
}

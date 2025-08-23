import { GetServerSideProps } from 'next'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { requireAdmin } from '@/lib/auth/requireAdmin'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const guard = await requireAdmin(ctx)
  // @ts-ignore
  if (guard.redirect) return guard
  const supabase = createServerSupabaseClient(ctx)
  const [{ count: users }, { count: gigs }, { count: apps }, { data: pending }] = await Promise.all([
    supabase.from('profiles').select('id', { count:'exact', head:true }),
    supabase.from('gigs').select('id', { count:'exact', head:true }),
    supabase.from('applications').select('id', { count:'exact', head:true }),
    supabase.from('payment_proofs').select('id').eq('status','pending')
  ])
  return { props: { users: users||0, gigs: gigs||0, apps: apps||0, pending: pending?.length||0 } }
}

export default function AdminHome({ users=0, gigs=0, apps=0, pending=0 }){
  const Card = ({title, value, href}:{title:string,value:number,href:string})=>(
    <a href={href} className="border rounded-2xl p-4 hover:shadow">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-3xl font-semibold">{value}</div>
    </a>
  )
  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Admin</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card title="Users" value={users} href="/admin/users"/>
        <Card title="Gigs" value={gigs} href="/admin/gigs"/>
        <Card title="Applications" value={apps} href="/admin/applications"/>
        <Card title="Pending proofs" value={pending} href="/admin/payments"/>
      </div>
    </main>
  )
}

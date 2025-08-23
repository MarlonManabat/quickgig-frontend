import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
export async function requireAdmin(ctx:any){
  const supabase = createServerSupabaseClient(ctx)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { redirect:{ destination:'/login', permanent:false } }
  const { data: prof } = await supabase.from('profiles').select('is_admin').eq('id', user.id).maybeSingle()
  if (!prof?.is_admin) return { redirect:{ destination:'/', permanent:false } }
  return { props:{} }
}

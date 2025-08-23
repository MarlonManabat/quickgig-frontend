import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

export async function requireProfile(ctx: any) {
  const supabase = createServerSupabaseClient(ctx)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { redirect: { destination: '/login', permanent: false } }
  const { data: prof } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .maybeSingle()
  if (!prof?.full_name) {
    return { redirect: { destination: '/profile', permanent: false } }
  }
  return { props: {} }
}

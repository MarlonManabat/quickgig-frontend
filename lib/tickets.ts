import { createClient } from '@supabase/supabase-js'
export async function getMyTicketBalance() {
  const supa = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  const { data, error } = await supa.from('ticket_balances').select('balance').eq('user_id', (await supa.auth.getUser()).data.user?.id ?? '').maybeSingle()
  if (error) return 0
  return data?.balance ?? 0
}

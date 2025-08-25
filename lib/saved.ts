import { supabase } from '@/utils/supabaseClient'

export async function isSaved(id: number) {
  const { data } = await supabase
    .from('saved_gigs')
    .select('gig_id')
    .eq('gig_id', id)
    .maybeSingle()
  return !!data
}

export async function toggleSave(id: number) {
  if (await isSaved(id)) {
    await supabase.from('saved_gigs').delete().eq('gig_id', id)
    return false
  } else {
    await supabase.from('saved_gigs').insert({ gig_id: id })
    return true
  }
}

export async function mySaved(limit = 20, from = 0) {
  return supabase
    .from('saved_gigs')
    .select('gig_id, created_at, gigs ( title, city, budget )')
    .neq('gigs.hidden', true)
    .order('created_at', { ascending: false })
    .range(from, from + limit - 1)
}

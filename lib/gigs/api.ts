import { getSupabaseBrowser } from '@/lib/supabase/browser'
import type { Gig } from '@/lib/db/types'

export async function listGigs() {
  const supabase = getSupabaseBrowser()
  if (!supabase) {
    // In build/SSR or misconfigured envs: return a safe default
    return []
  }
  const { data, error } = await supabase
    .from('gigs')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function getGig(id: number) {
  const supabase = getSupabaseBrowser()
  if (!supabase) return null
  const { data, error } = await supabase
    .from('gigs')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function createGig(gig: Partial<Gig>) {
  const supabase = getSupabaseBrowser()
  if (!supabase) throw new Error('Supabase client unavailable')
  const { data, error } = await supabase
    .from('gigs')
    .insert(gig)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateGig(id: number, gig: Partial<Gig>) {
  const supabase = getSupabaseBrowser()
  if (!supabase) throw new Error('Supabase client unavailable')
  const { data, error } = await supabase
    .from('gigs')
    .update(gig)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function toggleSave(id: number, saved: boolean) {
  const supabase = getSupabaseBrowser()
  if (!supabase) throw new Error('Supabase client unavailable')
  const {
    data: { user }
  } = await supabase.auth.getUser()
  if (!user) throw new Error('not logged in')
  if (saved) {
    return supabase.from('saved_gigs').delete().eq('gig_id', id).eq('user_id', user.id)
  }
  return supabase.from('saved_gigs').insert({ gig_id: id, user_id: user.id })
}

export async function applyToGig(id: number, message: string) {
  const supabase = getSupabaseBrowser()
  if (!supabase) throw new Error('Supabase client unavailable')
  const {
    data: { user }
  } = await supabase.auth.getUser()
  if (!user) throw new Error('not logged in')
  return supabase.from('applications').insert({ gig_id: id, applicant_id: user.id, message })
}

export async function listMyApplications() {
  const supabase = getSupabaseBrowser()
  if (!supabase) throw new Error('Supabase client unavailable')
  const {
    data: { user }
  } = await supabase.auth.getUser()
  if (!user) throw new Error('not logged in')
  const { data, error } = await supabase
    .from('applications')
    .select('*, gigs(*)')
    .eq('applicant_id', user.id)
  if (error) throw error
  return data ?? []
}

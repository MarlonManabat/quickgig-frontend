import { supabase } from '@/utils/supabaseClient'

export async function getOrCreateApplication(id: string, applicantId: string, coverLetter?: string) {
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('gig_id', id)
    .eq('applicant', applicantId)
    .maybeSingle()
  if (error) throw error
  if (data) return data
  const { data: inserted, error: insErr } = await supabase
    .from('applications')
    .insert({ gig_id: id, applicant: applicantId, cover_letter: coverLetter || null })
    .select()
    .single()
  if (insErr) throw insErr
  return inserted
}

export async function getOrCreateThread(applicationId: string) {
  const { data, error } = await supabase
    .from('threads')
    .select('*')
    .eq('application_id', applicationId)
    .maybeSingle()
  if (error) throw error
  if (data) return data
  const { data: inserted, error: insErr } = await supabase
    .from('threads')
    .insert({ application_id: applicationId })
    .select()
    .single()
  if (insErr) throw insErr
  return inserted
}

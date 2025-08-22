import { supabase } from '@/utils/supabaseClient'

export async function getOrCreateApplication(gigId: string, applicantId: string, coverLetter?: string) {
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('gig_id', gigId)
    .eq('applicant', applicantId)
    .maybeSingle()
  if (error) throw error
  if (data) return data
  const { data: inserted, error: insErr } = await supabase
    .from('applications')
    .insert({ gig_id: gigId, applicant: applicantId, cover_letter: coverLetter || null })
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

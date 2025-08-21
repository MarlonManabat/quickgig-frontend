import { supabase } from './supabaseClient'

export async function uploadUserFile(file: File) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const path = `${user.id}/${Date.now()}-${file.name}`
  const { error } = await supabase.storage.from('assets').upload(path, file, { upsert: true })
  if (error) throw error
  const { data } = supabase.storage.from('assets').getPublicUrl(path)
  return data.publicUrl
}

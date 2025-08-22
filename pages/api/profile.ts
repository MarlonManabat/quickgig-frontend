import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/utils/supabaseClient'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' })
  const { full_name, avatar_url } = req.body
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return res.status(401).json({ error: 'unauthorized' })
  const { data, error } = await supabase.from('profiles')
    .upsert({ id: user.id, full_name, avatar_url }, { onConflict: 'id' })
    .select()
    .single()
  if (error) return res.status(400).json({ error: error.message })
  return res.json({ ok: true, profile: data })
}

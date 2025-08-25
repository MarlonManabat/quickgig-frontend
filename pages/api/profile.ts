import type { NextApiRequest, NextApiResponse } from 'next'
import { requireSupabaseForApi } from '@/lib/supabase/server'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' })
  const supabase = requireSupabaseForApi(req, res)
  const { full_name, avatar_url } = req.body
  const { data: { user }, error: userErr } = await supabase.auth.getUser()
  if (userErr || !user) return res.status(401).json({ error: 'unauthorized' })
  const { data, error } = await supabase.from('profiles')
    .upsert({ id: user.id, full_name, avatar_url }, { onConflict: 'id' })
    .select()
    .single()
  if (error) return res.status(400).json({ error: error.message })
  return res.json({ ok: true, profile: data })
}

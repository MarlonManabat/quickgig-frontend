import type { NextApiRequest, NextApiResponse } from 'next'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const supabase = createServerSupabaseClient({ req, res })
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return res.status(401).end()
  const { full_name, avatar_url } = req.body || {}
  if (!full_name || typeof full_name !== 'string') {
    return res.status(400).json({ error: 'full_name required' })
  }
  const { error } = await supabase.rpc('secure_upsert_profile', { uid: user.id, full_name, avatar_url })
  if (error) return res.status(400).json({ error: error.message })
  res.status(200).json({ ok: true })
}

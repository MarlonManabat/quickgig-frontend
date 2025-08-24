import type { NextApiRequest, NextApiResponse } from 'next'
import { createServerClient } from '@/utils/supabaseClient'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'method not allowed' }); return; }
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) { res.status(401).json({ error: 'unauthorized' }); return; }
  const { error } = await supabase.rpc('app_cancel', { p_app_id: req.query.id })
  if (error) { res.status(400).json({ error: error.message }); return; }
  res.json({ ok: true })
}

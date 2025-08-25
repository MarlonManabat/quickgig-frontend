import type { NextApiRequest, NextApiResponse } from 'next'
import { requireSupabaseForApi } from '@/lib/supabase/server'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') { res.status(405).end(); return }
  const supabase = requireSupabaseForApi(req, res)
  let uid: string | null = null
  if (process.env.QA_TEST_MODE === 'true' && typeof req.headers['x-test-user'] === 'string') {
    uid = req.headers['x-test-user'] as string
  } else {
    const { data: { user }, error: userErr } = await supabase.auth.getUser()
    uid = userErr ? null : user?.id || null
  }
  if (!uid) { res.status(401).json({ error: 'unauthorized' }); return }
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('user_id', uid)
    .eq('read', false)
  if (error) { res.status(400).json({ error: error.message }); return }
  res.json({ ok: true })
}

import type { NextApiRequest, NextApiResponse } from 'next'
import { createServerClient } from '@/utils/supabaseClient'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') { res.status(405).end(); return }
  const supabase = createServerClient()
  let uid: string | null = null
  if (process.env.QA_TEST_MODE === 'true' && typeof req.headers['x-test-user'] === 'string') {
    uid = req.headers['x-test-user'] as string
  } else {
    const { data: { user } } = await supabase.auth.getUser()
    uid = user?.id || null
  }
  if (!uid) { res.status(401).json({ error: 'unauthorized' }); return }
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', req.query.id)
    .eq('user_id', uid)
  if (error) { res.status(400).json({ error: error.message }); return }
  res.json({ ok: true })
}

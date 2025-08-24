import type { NextApiRequest, NextApiResponse } from 'next'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const supabase = createServerSupabaseClient({ req, res })
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return res.status(401).json({ error: 'Unauthorized' })

  const { role } = (req.body ?? {}) as { role?: 'worker' | 'employer' }
  if (role !== 'worker' && role !== 'employer') return res.status(400).json({ error: 'Bad role' })

  const { error } = await supabase
    .from('profiles')
    .update({ role_pref: role })
    .eq('id', user.id)

  if (error) return res.status(400).json({ error: error.message })
  return res.json({ ok: true })
}

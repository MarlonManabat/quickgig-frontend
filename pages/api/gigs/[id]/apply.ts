import type { NextApiRequest, NextApiResponse } from 'next'
import { createServerClient } from '@/utils/supabaseClient'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'method not allowed' }); return; }
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) { res.status(401).json({ error: 'unauthorized' }); return; }
  const gigId = req.query.id
  const { cover_letter } = req.body || {}
  const { error } = await supabase.from('applications').insert({
    applicant_id: user.id,
    gig_id: gigId,
    message: cover_letter ?? null,
  })
  if (error) {
    if ((error as any).code === '23505') { res.status(409).json({ error: 'already applied' }); return; }
    res.status(400).json({ error: error.message }); return;
  }
  res.json({ ok: true })
}

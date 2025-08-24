import type { NextApiRequest, NextApiResponse } from 'next'
import { createServerClient } from '@/utils/supabaseClient'
import { emitNotification } from '@/lib/notifications'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'method not allowed' }); return; }
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) { res.status(401).json({ error: 'unauthorized' }); return; }
  const appId = req.query.id as string
  const { data: app } = await supabase
    .from('applications')
    .select('applicant_id, worker, gig_id')
    .eq('id', appId)
    .single()
  const applicantId = (app as any)?.applicant_id || (app as any)?.worker
  const { data: gig } = await supabase
    .from('gigs')
    .select('title')
    .eq('id', (app as any)?.gig_id)
    .single()

  const { error } = await supabase.rpc('app_offer', { p_app_id: appId })
  if (error) { res.status(400).json({ error: error.message }); return; }

  if (applicantId && gig?.title) {
    await emitNotification({
      userId: applicantId,
      type: 'offer_sent',
      title: 'You received an offer',
      body: `Good news! An employer sent you an offer on “${gig.title}”.\nReview and accept if you’re interested.`,
      link: `${process.env.NEXT_PUBLIC_APP_URL}/applications/${appId}`,
      uniq: `offer_sent:${appId}`,
    })
  }

  res.json({ ok: true })
}

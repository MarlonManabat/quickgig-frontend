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
    .select('gig_id, applicant_id, worker')
    .eq('id', appId)
    .single()
  const { data: gig } = await supabase
    .from('gigs')
    .select('title, owner_id')
    .eq('id', (app as any)?.gig_id)
    .single()

  const { error } = await supabase.rpc('app_complete', { p_app_id: appId })
  if (error) { res.status(400).json({ error: error.message }); return; }

  const workerId = (app as any)?.applicant_id || (app as any)?.worker
  const employerId = gig?.owner_id
  const gigTitle = gig?.title
  const gigId = (app as any)?.gig_id
  for (const target of [employerId, workerId]) {
    if (target && gigTitle) {
      await emitNotification({
        userId: target,
        type: 'job_completed',
        title: 'Gig marked completed',
        body: `“${gigTitle}” has been marked completed.`,
        link: `${process.env.NEXT_PUBLIC_APP_URL}/gigs/${gigId}`,
        uniq: `job_completed:${appId}:${target}`,
      })
    }
  }

  res.json({ ok: true })
}

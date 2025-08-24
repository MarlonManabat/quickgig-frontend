import type { NextApiRequest, NextApiResponse } from 'next'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { emitNotification } from '@/lib/notifications'

export default async function handler(req:NextApiRequest,res:NextApiResponse){
  if (req.method!=='POST') return res.status(405).end()
  const supabase = createServerSupabaseClient({ req, res })
  const { data:{ user } } = await supabase.auth.getUser()
  if (!user) return res.status(401).end()
  const { id, status, reason } = req.body||{}
  if (!['approved','flagged'].includes(status)) return res.status(400).json({error:'invalid status'})

  const { data: proof } = await supabase.from('payment_proofs').select('user_id').eq('id', id).single()

  const { error } = await supabase.rpc('admin_set_payment_status', { proof_id: id, new_status: status })
  if (error) return res.status(400).json({error:error.message})

  const employerId = (proof as any)?.user_id
  const qty = Number(process.env.NEXT_PUBLIC_TICKETS_PER_PROOF || '0')
  if (employerId) {
    if (status === 'approved') {
      await emitNotification({
        userId: employerId,
        type: 'gcash_approved',
        title: 'GCash top-up approved',
        body: `We added ${qty} ticket(s) to your balance. Salamat!`,
        link: `${process.env.NEXT_PUBLIC_APP_URL}/account/wallet`,
        uniq: `gcash_approved:${id}`,
      })
    }
    if (status === 'flagged') {
      await emitNotification({
        userId: employerId,
        type: 'gcash_rejected',
        title: 'GCash top-up rejected',
        body: `We couldn’t verify your GCash payment. Reason: ${reason || 'N/A'}. You can resubmit from your wallet.`,
        link: `${process.env.NEXT_PUBLIC_APP_URL}/account/wallet`,
        uniq: `gcash_rejected:${id}`,
      })
    }
  }

  res.status(200).json({ ok:true })
}

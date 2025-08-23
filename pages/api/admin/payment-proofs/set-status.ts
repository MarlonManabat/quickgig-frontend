import type { NextApiRequest, NextApiResponse } from 'next'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
export default async function handler(req:NextApiRequest,res:NextApiResponse){
  if (req.method!=='POST') return res.status(405).end()
  const supabase = createServerSupabaseClient({ req, res })
  const { data:{ user } } = await supabase.auth.getUser()
  if (!user) return res.status(401).end()
  const { id, status } = req.body||{}
  if (!['approved','flagged'].includes(status)) return res.status(400).json({error:'invalid status'})
  const { error } = await supabase.rpc('admin_set_payment_status', { proof_id: id, new_status: status })
  if (error) return res.status(400).json({error:error.message})
  res.status(200).json({ ok:true })
}

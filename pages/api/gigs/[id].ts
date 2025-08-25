import type { NextApiRequest, NextApiResponse } from 'next'
import { requireSupabaseForApi } from '@/lib/supabase/server'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'method not allowed' })
  const supabase = requireSupabaseForApi(req, res)
  const id = req.query.id
  const { data, error } = await supabase.from('gigs').select('*').eq('id', id).single()
  if (error) return res.status(404).json({ error: error.message })
  return res.json({ gig: data })
}

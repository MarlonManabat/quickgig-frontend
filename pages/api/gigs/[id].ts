import type { NextApiRequest, NextApiResponse } from 'next'
import { createServerClient } from '@/utils/supabaseClient'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'method not allowed' })
  const supabase = createServerClient()
  const id = req.query.id
  const { data, error } = await supabase.from('gigs').select('*').eq('id', id).single()
  if (error) return res.status(404).json({ error: error.message })
  return res.json({ gig: data })
}

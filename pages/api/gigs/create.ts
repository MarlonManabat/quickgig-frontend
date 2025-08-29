import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Admin client; this endpoint runs on the server
const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } })

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const { title, description, region_code, city_code, price_php, user_id } = req.body ?? {}
    if (!title || !description || !region_code || !city_code || !price_php || !user_id) {
      return res.status(400).json({ error: 'Missing fields' })
    }

    // Single source of truth: call the internal RPC that handles tickets + insert
    const { data, error } = await admin.rpc('rpc_debit_tickets_and_create_gig', {
      p_title: title,
      p_description: description,
      p_region_code: region_code,
      p_city_code: city_code,
      p_price_php: Number(price_php),
      p_user_id: user_id,
    })

    if (error) return res.status(400).json({ error: error.message })
    return res.status(200).json({ ok: true, gig: data })
  } catch (e: any) {
    return res.status(500).json({ error: e?.message ?? 'Internal error' })
  }
}

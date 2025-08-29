import type { NextApiRequest, NextApiResponse } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const supabase = createServerSupabaseClient({ req, res });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return res.status(401).json({ error: 'UNAUTHENTICATED' });

  const { order_id } = req.body ?? {};
  if (!order_id) return res.status(400).json({ error: 'MISSING_ORDER_ID' });

  const { error } = await supabase.rpc('admin_approve_order', { p_order_id: order_id });
  if (error) return res.status(400).json({ error: error.message });

  return res.status(200).json({ ok: true });
}


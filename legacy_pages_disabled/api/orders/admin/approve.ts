import type { NextApiRequest, NextApiResponse } from 'next';
import { requireUser, isAdmin } from '@/lib/apiAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { supabase, user } = await requireUser({ req, res });
  if (!isAdmin(user.email)) return res.status(403).json({ error: 'forbidden' });

  const { orderId } = req.body as { orderId: string };
  const { error } = await supabase.rpc('admin_approve_order', { p_order_id: orderId });
  if (error) return res.status(400).json({ error: error.message });
  return res.status(200).json({ ok: true });
}

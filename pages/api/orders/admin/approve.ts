import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getServerSession } from 'next-auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const session = await getServerSession({ req, res } as any);
  if (!session?.user?.id) return res.status(401).json({ error: 'unauthenticated' });
  // Basic server-side admin gate (RLS does final check)
  if (session.user.role !== 'admin') return res.status(403).json({ error: 'forbidden' });

  const { orderId } = req.body as { orderId: string };
  const { error } = await supabaseAdmin.rpc('admin_approve_order', { p_order_id: orderId });
  if (error) return res.status(400).json({ error: error.message });
  return res.status(200).json({ ok: true });
}

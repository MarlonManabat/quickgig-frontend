import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/utils/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') { res.status(405).end(); return; }
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) { res.status(401).json({ error: 'unauthenticated' }); return; }

  const { kind, target_id, reason } = req.body || {};
  if (!kind || !target_id) { res.status(400).json({ error: 'missing fields' }); return; }

  const { error } = await supabase.from('reports').insert({ kind, target_id, reason, reporter: user.id });
  if (error) { res.status(400).json({ error: error.message }); return; }
  res.json({ ok: true });
}

import type { NextApiRequest, NextApiResponse } from 'next';
import { requireSupabaseForApi } from '@/lib/supabase/server';
import { isAdmin } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'method not allowed' }); return; }
  const supabase = requireSupabaseForApi(req, res);
  await supabase.rpc('set_config', { setting_name: 'app.admin_emails', new_value: process.env.ADMIN_EMAILS ?? '', is_local: true });
  const { data: { user }, error: userErr } = await supabase.auth.getUser();
  if (userErr || !user || !isAdmin(user.email)) { res.status(403).json({ error: 'forbidden' }); return; }

  const { decision } = req.body || {};
  if (decision !== 'paid' && decision !== 'rejected') { res.status(400).json({ error: 'bad decision' }); return; }

  const { error } = await supabase.from('orders').update({ status: decision }).eq('id', req.query.id);
  if (error) { res.status(400).json({ error: error.message }); return; }
  res.json({ ok: true });
}

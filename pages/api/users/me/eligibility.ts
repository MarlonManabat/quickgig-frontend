import type { NextApiRequest, NextApiResponse } from 'next';
import { requireSupabaseForApi } from '@/lib/supabase/server';
import { canPostJob } from '@/lib/payments';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') { res.status(405).json({ error: 'method not allowed' }); return; }
  const supabase = requireSupabaseForApi(req, res);
  await supabase.rpc('set_config', { setting_name: 'app.admin_emails', new_value: process.env.ADMIN_EMAILS ?? '', is_local: true });
  const { data: { user }, error: userErr } = await supabase.auth.getUser();
  if (userErr || !user) { res.status(401).json({ error: 'unauthorized' }); return; }
  const { count } = await supabase.from('orders').select('id', { count: 'exact', head: true }).eq('user_id', user.id).eq('status', 'paid');
  res.json({ canPost: canPostJob((count ?? 0) > 0) });
}

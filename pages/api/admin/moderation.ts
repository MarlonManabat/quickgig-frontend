import type { NextApiRequest, NextApiResponse } from 'next';
import { requireSupabaseForApi } from '@/lib/supabase/server';
import { isAdminEmail } from '@/lib/authz';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') { res.status(405).end(); return; }
  const supabase = requireSupabaseForApi(req, res);
  const { data: { user }, error: userErr } = await supabase.auth.getUser();
  if (userErr || !isAdminEmail(user?.email)) { res.status(403).json({ error: 'forbidden' }); return; }

  const { action, kind, id } = req.body || {};
  if (!action || !kind || !id) { res.status(400).json({ error: 'missing fields' }); return; }

  if (kind === 'gig') {
    if (action === 'hide') await supabase.from('gigs').update({ hidden: true }).eq('id', id);
    if (action === 'unhide') await supabase.from('gigs').update({ hidden: false }).eq('id', id);
  }
  if (kind === 'profile') {
    if (action === 'hide') await supabase.from('profiles').update({ hidden: true }).eq('id', id);
    if (action === 'unhide') await supabase.from('profiles').update({ hidden: false }).eq('id', id);
    if (action === 'ban') await supabase.from('profiles').update({ blocked: true }).eq('id', id);
    if (action === 'unban') await supabase.from('profiles').update({ blocked: false }).eq('id', id);
  }
  res.json({ ok: true });
}

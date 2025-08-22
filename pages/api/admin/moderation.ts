import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/utils/supabaseClient';
import { isAdminEmail } from '@/lib/authz';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') { res.status(405).end(); return; }
  const { data: { user } } = await supabase.auth.getUser();
  if (!isAdminEmail(user?.email)) { res.status(403).json({ error: 'forbidden' }); return; }

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

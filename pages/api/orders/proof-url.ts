import type { NextApiRequest, NextApiResponse } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const supa = createServerSupabaseClient({ req, res });
  const { data: { user } } = await supa.auth.getUser();
  if (!user) return res.status(401).end();

  const { data: me } = await supa.from('profiles').select('role').eq('id', user.id).single();
  if (me?.role !== 'admin') return res.status(403).end();

  const { path } = req.body || {};
  if (!path) return res.status(400).json({ error: 'MISSING_PATH' });

  const { data, error } = await supa.storage.from('payments').createSignedUrl(path, 600);
  if (error) return res.status(400).json({ error: error.message });
  return res.status(200).json({ url: data.signedUrl });
}

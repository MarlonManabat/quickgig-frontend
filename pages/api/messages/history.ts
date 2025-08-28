import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSupabase } from '@/lib/supabase-server';
import { asString } from '@/lib/normalize';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end();
  const supabase = getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return res.status(401).json({ error: { code: 'UNAUTHORIZED' } });

  const applicationId = asString(req.query.applicationId);
  const cursor = asString(req.query.cursor);
  const limit = Number(asString(req.query.limit)) || 30;
  if (!applicationId)
    return res.status(400).json({ error: { code: 'APPLICATION_REQUIRED' } });

  let query = supabase
    .from('messages')
    .select('*')
    .eq('application_id', applicationId)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (cursor) query = query.lt('created_at', cursor);
  const { data, error } = await query;
  if (error)
    return res.status(400).json({ error: { code: 'DB_ERROR', message: error.message } });

  res.json({ items: (data || []).reverse() });
}

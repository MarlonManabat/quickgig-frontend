import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const regionCode = String(req.query.regionCode || '');
  if (!regionCode) return res.status(400).json({ error: 'regionCode required' });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return res.status(500).json([]);
  const supabase = createClient(url, key);
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 2500);
  try {
    const { data, error } = await supabase
      .from('provinces')
      .select('id,name,regionCode')
      .eq('regionCode', regionCode)
      .order('name')
      .abortSignal(controller.signal);
    if (error) throw error;
    res.json(data ?? []);
  } catch (err: any) {
    res.status(500).json({ error: err.message ?? String(err) });
  } finally {
    clearTimeout(id);
  }
}

import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/db';
import { env, requireServer } from '@/lib/env';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const key = requireServer('SUPABASE_SERVICE_ROLE');
  if (!url || !key) return res.status(500).json([]);
  const supabase = createClient<Database>(url, key);
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 2500);
  try {
    const { data, error } = await supabase
      .from('regions')
      .select('id,code,name')
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

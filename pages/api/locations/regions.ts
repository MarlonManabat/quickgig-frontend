import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { env, requireServer } from '@/lib/env';

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  const key = requireServer('SUPABASE_SERVICE_ROLE_KEY');
  if (!key) return res.status(500).json([]);
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, key);
  const { data, error } = await supabase
    .from('ph_regions')
    .select('code,name')
    .order('name');
  if (error) return res.status(500).json({ error: error.message });
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=86400, stale-while-revalidate=604800'
  );
  res.json(data ?? []);
}

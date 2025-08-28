import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const region = String(req.query.region ?? '');
  if (!region) return res.status(400).json({ error: 'region required' });
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data, error } = await supabase
    .from('ph_provinces')
    .select('code,name')
    .eq('region_code', region)
    .order('name');
  if (error) return res.status(500).json({ error: error.message });
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=86400, stale-while-revalidate=604800'
  );
  res.json({ provinces: data ?? [] });
}

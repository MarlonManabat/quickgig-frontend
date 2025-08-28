import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const NCR_REGION_CODE = '130000000';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const regionId = String(req.query.region_id ?? '');
  if (!regionId) return res.status(400).json({ error: 'region_id required' });
  if (regionId === NCR_REGION_CODE) {
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=3600, stale-while-revalidate=21600'
    );
    return res.json([]);
  }
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  const { data, error } = await supabase
    .from('ph_provinces')
    .select('code,name')
    .eq('region_code', regionId)
    .order('name');
  if (error) return res.status(500).json({ error: error.message });
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=3600, stale-while-revalidate=21600'
  );
  const provinces = (data ?? []).map((p) => ({ id: p.code, name: p.name }));
  res.json(provinces);
}

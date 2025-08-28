import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from '@supabase/supabase-js';

const NCR_REGION_CODE = '130000000';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const regionId = String(req.query.region_id ?? '');
  const provinceId = String(req.query.province_id ?? '');
  if (!regionId) return res.status(400).json({ error: 'region_id required' });
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  let query = supabase
    .from('ph_cities')
    .select('code,name')
    .order('name');
  if (regionId === NCR_REGION_CODE) {
    query = query.eq('region_code', regionId);
  } else {
    if (!provinceId) return res.status(400).json({ error: 'province_id required' });
    query = query.eq('province_code', provinceId);
  }
  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=3600, stale-while-revalidate=21600'
  );
  const cities = (data ?? []).map((c) => ({ id: c.code, name: c.name }));
  res.json(cities);
}

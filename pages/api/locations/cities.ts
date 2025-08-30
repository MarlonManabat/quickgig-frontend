import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/db';
import citiesJson from '../../../public/data/ph/cities.json';

const NCR_REGION_CODE = '130000000';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const regionId = String(req.query.region_id ?? '');
  const provinceId = String(req.query.province_id ?? '');
  if (!regionId) return res.status(400).json({ error: 'region_id required' });

  let rows: { id: string; name: string }[] | null = null;

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
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
    const { data } = await query;
    if (data && data.length) rows = data.map((c) => ({ id: c.code, name: c.name }));
  }

  if (!rows || !rows.length) {
    let filtered = (citiesJson as any[]).filter((c: any) => c.region_code === regionId);
    if (regionId !== NCR_REGION_CODE) {
      if (!provinceId) return res.status(400).json({ error: 'province_id required' });
      filtered = filtered.filter((c: any) => c.province_code === provinceId);
    }
    rows = filtered.map((c: any) => ({ id: c.city_code, name: c.city_name }));
  }

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=3600, stale-while-revalidate=21600'
  );
  res.json(rows);
}

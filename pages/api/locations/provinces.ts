import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/db';
import provincesJson from '../../../public/data/ph/provinces.json';

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
    // NCR is treated as a single province "Metro Manila"
    return res.json([{ id: 'NCR', name: 'Metro Manila' }]);
  }

  let rows: { id: string; name: string }[] | null = null;

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    );
    const { data } = await supabase
      .from('ph_provinces')
      .select('code,name')
      .eq('region_code', regionId)
      .order('name');
    if (data && data.length) rows = data.map((p) => ({ id: p.code, name: p.name }));
  }

  if (!rows || !rows.length) {
    rows = (provincesJson as any[])
      .filter((p: any) => p.region_code === regionId)
      .map((p: any) => ({ id: p.province_code, name: p.province_name }));
  }

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=3600, stale-while-revalidate=21600'
  );
  res.json(rows);
}

import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from '@supabase/supabase-js';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const province = String(req.query.province ?? '');
  if (!province) return res.status(400).json({ error: 'province required' });
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data, error } = await supabase
    .from('ph_cities')
    .select('code,name')
    .eq('province_code', province)
    .order('name');
  if (error) return res.status(500).json({ error: error.message });
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=86400, stale-while-revalidate=604800'
  );
  res.json({ cities: data ?? [] });
}

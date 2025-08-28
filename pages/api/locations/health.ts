import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from '@supabase/supabase-js';

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  const [regions, provinces, cities] = await Promise.all([
    supabase.from('ph_regions').select('*', { count: 'exact', head: true }),
    supabase.from('ph_provinces').select('*', { count: 'exact', head: true }),
    supabase.from('ph_cities').select('*', { count: 'exact', head: true }),
  ]);
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=3600, stale-while-revalidate=21600'
  );
  res.json({
    regions: regions.count ?? 0,
    provinces: provinces.count ?? 0,
    cities: cities.count ?? 0,
  });
}

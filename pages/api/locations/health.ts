import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { requireServer } from '@/lib/env';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = requireServer('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(url, key);

    const regionName = 'National Capital Region';
    const provinceName = 'Metro Manila';

    const { data: region } = await supabase
      .from('ph_regions')
      .select('code')
      .eq('name', regionName)
      .single();
    const { data: province } = await supabase
      .from('ph_provinces')
      .select('code')
      .eq('name', provinceName)
      .single();
    const regionCode = region?.code;
    const provinceCode = province?.code;

    let ncrCityCount = 0;
    if (regionCode && provinceCode) {
      const { count } = await supabase
        .from('ph_cities')
        .select('code', { head: true, count: 'exact' })
        .eq('region_code', regionCode)
        .eq('province_code', provinceCode);
      ncrCityCount = count ?? 0;
    }

    res.json({
      ok: ncrCityCount >= 16,
      ncrCityCount,
      province: provinceName,
      region: regionName,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

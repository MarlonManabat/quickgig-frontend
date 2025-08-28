import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { requireServer } from '@/lib/env';

const NCR_CITIES = [
  'Caloocan',
  'Las Piñas',
  'Makati',
  'Malabon',
  'Mandaluyong',
  'Manila',
  'Marikina',
  'Muntinlupa',
  'Navotas',
  'Parañaque',
  'Pasay',
  'Pasig',
  'Quezon City',
  'San Juan',
  'Taguig',
  'Valenzuela',
];

function slug(code: string) {
  return code.replace(/[^A-Za-z0-9]+/g, '_').toUpperCase();
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  if (req.headers['x-self-heal'] !== process.env.SELF_HEAL_TOKEN)
    return res.status(403).json({ error: 'forbidden' });

  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = requireServer('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(url, key);

    const regionName = 'National Capital Region';
    const provinceName = 'Metro Manila';

    const { data: regionData } = await supabase
      .from('ph_regions')
      .upsert({ code: '130000000', name: regionName }, { onConflict: 'code' })
      .select('code')
      .single();
    const regionCode = regionData?.code || '130000000';

    const { data: provinceData } = await supabase
      .from('ph_provinces')
      .upsert(
        { code: 'NCR', name: provinceName, region_code: regionCode },
        { onConflict: 'code' },
      )
      .select('code')
      .single();
    const provinceCode = provinceData?.code || 'NCR';

    const { data: existing } = await supabase
      .from('ph_cities')
      .select('name')
      .eq('region_code', regionCode)
      .eq('province_code', provinceCode);
    const existingNames = new Set((existing ?? []).map((r: any) => r.name));

    const rows = NCR_CITIES.filter((c) => !existingNames.has(c)).map((name) => ({
      code: `NCR_${slug(name)}`,
      name,
      region_code: regionCode,
      province_code: provinceCode,
    }));

    if (rows.length) {
      await supabase.from('ph_cities').upsert(rows);
    }

    const { count: totalAfter } = await supabase
      .from('ph_cities')
      .select('code', { head: true, count: 'exact' })
      .eq('region_code', regionCode)
      .eq('province_code', provinceCode);

    res.json({ repaired: true, inserted: rows.length, totalAfter: totalAfter ?? 0 });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

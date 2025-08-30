import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/db';
import regions from '@/data/ph/regions.json';
import provinces from '@/data/ph/provinces.json';
import cities from '@/data/ph/cities.json';

async function run() {
  if (process.env.SEED !== 'true') {
    console.log('SEED flag not set; skipping');
    return;
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE!;
  const supabase = createClient<Database>(url, key);
  await supabase.from('ph_regions').upsert(
    regions.map((r) => ({ code: r.code, name: r.name }))
  );
  await supabase.from('ph_provinces').upsert(
    provinces.map((p) => ({
      code: p.province_code,
      region_code: p.region_code,
      name: p.province_name,
    }))
  );
  await supabase.from('ph_cities').upsert(
    cities.map((c) => ({
      code: c.city_code,
      province_code: c.province_code,
      region_code: c.region_code,
      name: c.city_name,
      class: c.is_city ? 'City' : 'Municipality',
    }))
  );
  console.log('Seeded PH locations');
}

run();

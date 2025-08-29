import { createClient } from '@supabase/supabase-js';
import regions from '../public/data/ph/regions.json';
import adminAreas from '../public/data/ph/admin_areas.json';
import cities from '../public/data/ph/cities.json';

async function run() {
  if (process.env.SEED !== 'true') {
    console.log('SEED flag not set; skipping');
    return;
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE!;
  const supabase = createClient(url, key);
  await supabase.from('ph_regions').upsert(
    regions.map((r) => ({ code: r.code, name: r.name }))
  );
  await supabase.from('ph_provinces').upsert(
    adminAreas
      .filter((a) => a.type === 'PROVINCE')
      .map((p) => ({ code: p.code, region_code: p.regionCode, name: p.name }))
  );
  await supabase.from('ph_cities').upsert(
    cities.map((c) => ({
      code: c.code,
      province_code: c.adminUnitCode,
      region_code: c.regionCode,
      name: c.name,
      class: c.type,
    }))
  );
  console.log('Seeded PH locations');
}

run();

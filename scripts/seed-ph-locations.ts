import 'dotenv/config';
import { readFileSync } from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { env, requireServer } from '@/lib/env';

function parseCSV(text: string) {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines.shift()!.split(',');
  return lines.map((line) => {
    const regex = /(\"(?:[^\"]|\"\")*\"|[^,]*)/g;
    const values = Array.from(line.matchAll(regex)).map((m) =>
      m[0].replace(/^"|"$/g, '').replace(/""/g, '"')
    );
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => (obj[h] = values[i]));
    return obj;
  });
}

async function run() {
  const key = requireServer('SUPABASE_SERVICE_ROLE_KEY');
  if (!key) {
    console.log('Skipping seed: no service role key');
    return;
  }
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, key, {
    auth: { persistSession: false },
  });
  const base = path.join(process.cwd(), 'data/psgc');
  const regions = parseCSV(readFileSync(path.join(base, 'regions.csv'), 'utf8'));
  const provinces = parseCSV(readFileSync(path.join(base, 'provinces.csv'), 'utf8'));
  const cities = parseCSV(readFileSync(path.join(base, 'cities.csv'), 'utf8'));
  await supabase.from('ph_regions').upsert(regions, { onConflict: 'code' });
  await supabase.from('ph_provinces').upsert(provinces, { onConflict: 'code' });
  await supabase.from('ph_cities').upsert(cities, { onConflict: 'code' });
  console.log('Seeded PH locations');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

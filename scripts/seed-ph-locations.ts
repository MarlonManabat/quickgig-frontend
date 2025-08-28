import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE;
if (!key) throw new Error('SUPABASE_SERVICE_ROLE required');
const supabase = createClient(url, key);

function loadCSV(file: string) {
  const text = fs.readFileSync(file, 'utf8');
  const [header, ...lines] = text.trim().split(/\r?\n/);
  const cols = header.split(',');
  return lines.map(line => {
    const vals = line.split(',');
    const obj: any = {};
    cols.forEach((c, i) => obj[c] = vals[i]);
    return obj;
  });
}

async function run() {
  const base = path.resolve(__dirname, '../data/psgc');
  const regions = loadCSV(path.join(base, 'regions.csv'));
  const provinces = loadCSV(path.join(base, 'provinces.csv'));
  const cities = loadCSV(path.join(base, 'cities.csv'));
  await supabase.from('ph_regions').upsert(regions);
  await supabase.from('ph_provinces').upsert(provinces);
  await supabase.from('ph_cities').upsert(cities);
  console.log('Seeded locations');
}

run();

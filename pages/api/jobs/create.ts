import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { env, requireServer } from '@/lib/env';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { title, region_code, province_code, city_code } = req.body;
  if (!title || !region_code || !province_code || !city_code)
    return res.status(400).json({ error: 'missing fields' });
  const key = requireServer('SUPABASE_SERVICE_ROLE_KEY');
  if (!key) return res.status(500).json({ error: 'no service key' });
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, key);
  const { data: city } = await supabase
    .from('ph_cities')
    .select('name,province_code,region_code')
    .eq('code', city_code)
    .single();
  if (!city || city.province_code !== province_code || city.region_code !== region_code)
    return res.status(400).json({ error: 'location mismatch' });
  const { data: prov } = await supabase
    .from('ph_provinces')
    .select('name,region_code')
    .eq('code', province_code)
    .single();
  const { data: reg } = await supabase
    .from('ph_regions')
    .select('name')
    .eq('code', region_code)
    .single();
  const payload = {
    title,
    region_code,
    province_code,
    city_code,
    region_name: reg?.name,
    province_name: prov?.name,
    city_name: city?.name,
  };
  const { data, error } = await supabase.from('jobs').insert(payload).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json({ job: data });
}

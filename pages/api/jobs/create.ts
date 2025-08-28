import type { NextApiRequest, NextApiResponse } from 'next';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') return res.status(405).end();

  const supabase = createPagesServerClient({ req, res }, {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return res.status(401).json({ error: 'unauthorized' });

  const { title, description, region_code, province_code, city_code } = req.body || {};
  if (!title || !description || !region_code || !province_code || !city_code)
    return res.status(400).json({ error: 'missing fields' });

  const { data: region } = await supabase
    .from('ph_regions')
    .select('code,name')
    .eq('code', region_code)
    .single();
  const { data: province } = await supabase
    .from('ph_provinces')
    .select('code,region_code,name')
    .eq('code', province_code)
    .single();
  const { data: city } = await supabase
    .from('ph_cities')
    .select('code,province_code,region_code,name')
    .eq('code', city_code)
    .single();

  if (
    !region ||
    !province ||
    !city ||
    province.region_code !== region_code ||
    city.province_code !== province_code ||
    city.region_code !== region_code
  ) {
    return res.status(400).json({ error: 'invalid location' });
  }

  const { data, error } = await supabase
    .from('jobs')
    .insert({
      title,
      description,
      region_code,
      province_code,
      city_code,
      region_name: region.name,
      province_name: province.name,
      city_name: city.name,
      owner_id: user.id,
    })
    .select('id')
    .single();
  if (error) return res.status(400).json({ error: error.message });

  const { error: rpcError } = await supabase.rpc('decrement_credit');
  if (rpcError) return res.status(400).json({ error: rpcError.message });

  res.status(200).json({ id: data.id });
}

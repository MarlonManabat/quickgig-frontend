import type { NextApiRequest, NextApiResponse } from 'next';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import type { Database, Insert } from '@/types/db';

const limiter = new Map<string, { count: number; ts: number }>();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') return res.status(405).end();

  const ip =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
    req.socket.remoteAddress ||
    'anon';
  const now = Date.now();
  const record = limiter.get(ip);
  if (record && now - record.ts < 60000) {
    if (record.count >= 10) {
      return res.status(429).json({ error: { code: 'RATE_LIMITED' } });
    }
    record.count += 1;
  } else {
    limiter.set(ip, { count: 1, ts: now });
  }

  const supabase = createPagesServerClient<Database>({ req, res }, {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return res.status(401).json({ error: { code: 'UNAUTHORIZED' } });

  const { title, description, region_code, province_code, city_code } = req.body || {};
  const fieldErrors: Record<string, string> = {};
  if (typeof title !== 'string' || title.trim().length < 3 || title.trim().length > 120)
    fieldErrors.title = 'Invalid title';
  if (typeof description !== 'string' || description.trim().length < 20)
    fieldErrors.description = 'Invalid description';
  if (!region_code) fieldErrors.region = 'Region required';
  if (!province_code) fieldErrors.province = 'Province required';
  if (!city_code) fieldErrors.city = 'City required';
  if (Object.keys(fieldErrors).length)
    return res.status(400).json({ error: { code: 'VALIDATION_FAILED', fields: fieldErrors } });

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
    return res
      .status(400)
      .json({ error: { code: 'VALIDATION_FAILED', fields: { location: 'invalid hierarchy' } } });
  }

  const { data: creditData } = await supabase
    .from('user_credits')
    .select('credits')
    .eq('user_id', user.id)
    .maybeSingle();
  if ((creditData?.credits ?? 0) <= 0)
    return res.status(402).json({ error: { code: 'INSUFFICIENT_CREDITS' } });

  const { data, error } = await supabase
    .from('jobs')
    .insert([
      {
        title,
        description,
        region_code,
        province_code,
        city_code,
        region_name: region.name,
        province_name: province.name,
        city_name: city.name,
        owner_id: user.id,
      } satisfies Insert<'jobs'>,
    ])
    .select('id')
    .single();
  if (error) return res.status(400).json({ error: { code: 'DB_ERROR', message: error.message } });

  const { error: rpcError } = await supabase.rpc('decrement_credit');
  if (rpcError)
    return res.status(400).json({ error: { code: 'DB_ERROR', message: rpcError.message } });

  res.status(200).json({ id: data.id });
}

import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/db';
import regionsJson from '@/data/ph/regions.json';

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  let rows: { id: string; name: string }[] | null = null;

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    );
    const { data } = await supabase
      .from('ph_regions')
      .select('code,name')
      .order('name');
    if (data && data.length) rows = data.map((r) => ({ id: r.code, name: r.name }));
  }

  if (!rows || !rows.length) {
    rows = (regionsJson as any[]).map((r: any) => ({ id: r.region_code, name: r.region_name }));
  }

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=3600, stale-while-revalidate=21600'
  );
  res.json(rows);
}

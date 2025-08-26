import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const only = String(req.query.only ?? '');
  const doLocations = !only || only === 'locations';

  if (doLocations) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const regions = [
      { id: '11111111-1111-1111-1111-111111111111', name: 'NCR' },
      { id: '22222222-2222-2222-2222-222222222222', name: 'Region IV-A' },
    ];
    for (const r of regions) {
      await supabase.from('regions').upsert(r, { onConflict: 'id' });
    }
    const cities = [
      { id: 'aaaaaaa1-0000-0000-0000-000000000001', region_id: regions[0].id, name: 'Quezon City' },
      { id: 'aaaaaaa2-0000-0000-0000-000000000002', region_id: regions[0].id, name: 'Manila' },
      { id: 'bbbbbbb1-0000-0000-0000-000000000001', region_id: regions[1].id, name: 'Cabuyao' },
    ];
    for (const c of cities) {
      await supabase.from('cities').upsert(c, { onConflict: 'id' });
    }
  }

  return res.status(200).json({ ok: true });
}

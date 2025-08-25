import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.TEST_ENABLE_SEED !== 'true') return res.status(403).end();

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) return res.status(500).json({ error: 'Missing envs' });

  const supa = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

  try {
    const { data: employer } = await supa
      .from('profiles')
      .upsert(
        { id: '00000000-0000-0000-0000-000000000001', role: 'employer', email: 'e2e+employer@quickgig.test' },
        { onConflict: 'id' }
      )
      .select('*')
      .single();

    await supa.from('ticket_balances').upsert({ user_id: employer!.id, balance: 5 });

    return res.json({ ok: true });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || 'seed failed' });
  }
}

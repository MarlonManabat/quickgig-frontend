import type { NextApiRequest, NextApiResponse } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/db/types';

async function deleteAllUsers(supabase: SupabaseClient<any, any, any>) {
  await supabase.from('profiles').delete().neq('id', '');
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.query.secret !== process.env.QA_TEST_SECRET) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const supabase = createServerSupabaseClient<Database>({ req, res });

  try {
    await deleteAllUsers(supabase);
    res.status(200).json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e?.message || 'error' });
  }
}

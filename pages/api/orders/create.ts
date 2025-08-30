import type { NextApiRequest, NextApiResponse } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import type { Database, Insert } from '@/types/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const supabase = createServerSupabaseClient<Database>({ req, res });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return res.status(401).json({ error: 'UNAUTHENTICATED' });

  const { amount, credits, proof_path } = req.body ?? {};
  if (!amount || !credits || !proof_path) return res.status(400).json({ error: 'MISSING_FIELDS' });

  const { error } = await supabase
    .from('orders')
    .insert([
      { user_id: user.id, amount, credits, proof_path, status: 'pending' } satisfies Insert<'orders'>,
    ]);
  if (error) return res.status(400).json({ error: error.message });

  return res.status(200).json({ ok: true });
}


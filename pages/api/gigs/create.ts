import type { NextApiRequest, NextApiResponse } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const supabase = createServerSupabaseClient({ req, res });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return res.status(401).json({ error: 'UNAUTHENTICATED' });

  const { title, description, region_code, city_code, budget } = req.body ?? {};
  if (!title || !description || !region_code || !city_code)
    return res.status(400).json({ error: 'MISSING_FIELDS' });

  const { data, error } = await supabase.rpc('decrement_credit_and_create_gig', {
    p_title: title,
    p_description: description,
    p_region_code: region_code,
    p_city_code: city_code,
    p_budget: budget ?? null,
  });

  if (error) {
    if (error.message.includes('NO_CREDITS')) return res.status(402).json({ error: 'NO_CREDITS' });
    if (error.message.includes('AUTH_REQUIRED')) return res.status(401).json({ error: 'UNAUTHENTICATED' });
    return res.status(400).json({ error: error.message });
  }
  return res.status(200).json({ ok: true, gig_id: data });
}


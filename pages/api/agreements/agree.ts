import type { NextApiRequest, NextApiResponse } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const supabase = createServerSupabaseClient({ req, res });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const { agreementId } = req.body as { agreementId: string };
  const { data: ag, error } = await supabase
    .from('agreements')
    .update({ status: 'agreed' })
    .eq('id', agreementId)
    .select('*')
    .single();

  if (error) return res.status(400).json({ error: error.message });
  return res.json({ ok: true, agreement: ag });
}

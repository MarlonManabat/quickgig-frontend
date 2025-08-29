import type { NextApiRequest, NextApiResponse } from 'next';
import { requireUser } from '@/lib/apiAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { supabase } = await requireUser({ req, res });

  const { agreementId } = req.body as { agreementId: string };
  const { error } = await supabase.rpc('finalize_agreement', { p_agreement_id: agreementId });
  if (error) return res.status(400).json({ error: error.message });
  return res.status(200).json({ ok: true });
}

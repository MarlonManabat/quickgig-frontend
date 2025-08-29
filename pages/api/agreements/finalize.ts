import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getServerSession } from 'next-auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const session = await getServerSession({ req, res } as any);
  if (!session?.user?.id) return res.status(401).json({ error: 'unauthenticated' });

  const { agreementId } = req.body as { agreementId: string };
  const { error } = await supabaseAdmin.rpc('finalize_agreement', { p_agreement_id: agreementId });
  if (error) return res.status(400).json({ error: error.message });
  return res.status(200).json({ ok: true });
}

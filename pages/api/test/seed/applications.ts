import type { NextApiRequest, NextApiResponse } from 'next';
import { admin, assertSeedEnabled } from './_util';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') return res.status(405).end();
    assertSeedEnabled(req);

    const { gigId, workerId, status = 'pending' } = req.body ?? {};
    const supa = admin();
    const { data, error } = await supa
      .from('applications')
      .insert({ gig_id: gigId, applicant_id: workerId, status })
      .select('id')
      .single();

    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json({ id: data!.id });
  } catch (e: any) {
    return res.status(400).json({ error: e?.message || 'seed failed' });
  }
}

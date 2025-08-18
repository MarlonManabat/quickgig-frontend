import type { NextApiRequest, NextApiResponse } from 'next';
import { createOffer } from '@/lib/engine/hiring';
import { z } from '@/lib/zod';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }
  const { id } = req.query as { id: string };
  try {
    const str = { parse: (v: unknown) => (typeof v === 'string' ? v : undefined) };
    const schema = z.object({ startDate: str, rate: str, notes: str });
    const terms = schema.parse(req.body || {});
    const data = await createOffer(id, terms);
    res.status(200).json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'offer failed';
    res.status(400).json({ error: message });
  }
}

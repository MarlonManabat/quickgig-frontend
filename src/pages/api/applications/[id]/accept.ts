import type { NextApiRequest, NextApiResponse } from 'next';
import { acceptOffer } from '@/lib/engine/hiring';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }
  const { id } = req.query as { id: string };
  try {
    const data = await acceptOffer(id);
    res.status(200).json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'accept failed';
    res.status(400).json({ error: message });
  }
}

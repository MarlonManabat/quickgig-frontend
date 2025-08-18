import type { NextApiRequest, NextApiResponse } from 'next';
import { markHired } from '@/lib/engine/hiring';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }
  const { id } = req.query as { id: string };
  try {
    const data = await markHired(id);
    res.status(200).json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'hire failed';
    res.status(400).json({ error: message });
  }
}

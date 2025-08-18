/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from 'next';
import { bulkRejectJob } from '@/lib/employerStore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }
  const { id } = req.query as { id: string };
  try {
    const data = await bulkRejectJob(id, req.headers.cookie);
    res.status(200).json(data);
  } catch (err) {
    res
      .status((err as any).status || 400)
      .json({ error: (err as any).message || 'Unable to bulk reject' });
  }
}

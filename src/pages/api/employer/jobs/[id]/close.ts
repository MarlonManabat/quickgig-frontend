/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { closeJob } from '@/lib/employerStore';

const schema = z.object({
  reason: z.union([
    z.literal('filled'),
    z.literal('paused'),
    z.literal('expired'),
    z.literal('other'),
  ]),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }
  const { id } = req.query as { id: string };
  try {
    const { reason } = schema.parse(req.body);
    const data = await closeJob(id, {
      reason,
      note: (req.body as any)?.note,
      bulkNotify: (req.body as any)?.bulkNotify,
    }, req.headers.cookie);
    res.status(200).json(data);
  } catch (err) {
    res
      .status((err as any).status || 400)
      .json({ error: (err as any).message || 'Unable to close job' });
  }
}

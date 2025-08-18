/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from 'next';
import { getJob, updateJob } from '@/lib/employerStore';
import { get, patch } from '@/lib/engine';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query as { id: string };
  if (req.method === 'GET') {
    try {
      const job = await get(`/api/employer/jobs/${id}`, req, () => getJob(id));
      if (!job) { res.status(404).end(); return; }
      res.status(200).json(job);
    } catch (err) {
      res.status((err as any).status || 500).json({ error: (err as any).message || 'engine error' });
    }
    return;
  }
  if (req.method === 'PATCH') {
    try {
      const updated = await patch(`/api/employer/jobs/${id}`, req.body, req, () => updateJob(id, req.body));
      res.status(200).json(updated);
    } catch (err) {
      res.status((err as any).status || 400).json({ error: (err as any).message || 'Unable to update' });
    }
    return;
  }
  res.status(405).end();
}

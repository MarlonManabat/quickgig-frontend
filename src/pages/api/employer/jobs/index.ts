/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from 'next';
import { listJobs, createJobDraft } from '@/lib/employerStore';
import { get, post } from '@/lib/engine';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const jobs = await get('/api/employer/jobs', req, () => listJobs());
      res.status(200).json(jobs);
    } catch (err) {
      res.status((err as any).status || 500).json({ error: (err as any).message || 'engine error' });
    }
    return;
  }
  if (req.method === 'POST') {
    try {
      const job = await post('/api/employer/jobs', req.body, req, () => createJobDraft());
      res.status(200).json(job);
    } catch (err) {
      res.status((err as any).status || 500).json({ error: (err as any).message || 'engine error' });
    }
    return;
  }
  res.status(405).end();
}

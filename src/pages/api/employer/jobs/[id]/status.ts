/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from 'next';
import { publishJob, pauseJob, updateJob } from '@/lib/employerStore';
import type { EmployerJob } from '@/lib/employerStore';
import { patch } from '@/lib/engine';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query as { id: string };
  if (req.method !== 'PATCH') {
    res.status(405).end();
    return;
  }
  try {
    const data = await patch(`/api/employer/jobs/${id}/status`, req.body, req, async () => {
      const status = req.body?.status;
      let job: EmployerJob;
      if (status === 'published') job = await publishJob(id);
      else if (status === 'paused') job = await pauseJob(id);
      else job = await updateJob(id, { status });
      return job;
    });
    res.status(200).json(data);
  } catch (err) {
    res.status((err as any).status || 400).json({ error: (err as any).message || 'Unable to update' });
  }
}

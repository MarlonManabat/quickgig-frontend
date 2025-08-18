import type { NextApiRequest, NextApiResponse } from 'next';
import { publishJob, pauseJob, updateJob } from '@/lib/employerStore';
import type { EmployerJob } from '@/lib/employerStore';

const MODE = process.env.ENGINE_MODE || 'mock';
const BASE = process.env.ENGINE_BASE_URL || '';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query as { id: string };
  if (req.method !== 'PATCH') {
    res.status(405).end();
    return;
  }
  if (MODE !== 'mock') {
    const r = await fetch(`${BASE}/api/employer/jobs/${id}/status`, {
      method: 'PATCH',
      headers: { cookie: req.headers.cookie || '', 'content-type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    const text = await r.text();
    res.status(r.status).send(text);
    return;
  }
  const status = req.body?.status;
  try {
    let job: EmployerJob;
    if (status === 'published') job = await publishJob(id);
    else if (status === 'paused') job = await pauseJob(id);
    else job = await updateJob(id, { status });
    res.status(200).json(job);
  } catch {
    res.status(400).json({ error: 'Unable to update' });
  }
}

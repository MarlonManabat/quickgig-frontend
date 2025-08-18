import type { NextApiRequest, NextApiResponse } from 'next';
import { getJob, updateJob } from '@/lib/employerStore';

const MODE = process.env.ENGINE_MODE || 'mock';
const BASE = process.env.ENGINE_BASE_URL || '';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query as { id: string };
  if (MODE !== 'mock') {
    const r = await fetch(`${BASE}/api/employer/jobs/${id}`, {
      method: req.method,
      headers: { cookie: req.headers.cookie || '', 'content-type': 'application/json' },
      body: req.method === 'PATCH' ? JSON.stringify(req.body) : undefined,
    });
    const text = await r.text();
    res.status(r.status).send(text);
    return;
  }
  if (req.method === 'GET') {
    const job = await getJob(id);
    if (!job) {
      res.status(404).end();
      return;
    }
    res.status(200).json(job);
    return;
  }
  if (req.method === 'PATCH') {
    try {
      const updated = await updateJob(id, req.body);
      res.status(200).json(updated);
    } catch {
      res.status(400).json({ error: 'Unable to update' });
    }
    return;
  }
  res.status(405).end();
}

import type { NextApiRequest, NextApiResponse } from 'next';
import { listJobs, createJobDraft } from '@/lib/employerStore';

const MODE = process.env.ENGINE_MODE || 'mock';
const BASE = process.env.ENGINE_BASE_URL || '';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (MODE !== 'mock') {
    const r = await fetch(`${BASE}/api/employer/jobs`, {
      method: req.method,
      headers: { cookie: req.headers.cookie || '', 'content-type': 'application/json' },
      body: req.method === 'POST' ? JSON.stringify(req.body) : undefined,
    });
    const text = await r.text();
    res.status(r.status).send(text);
    return;
  }
  if (req.method === 'GET') {
    const jobs = await listJobs();
    res.status(200).json(jobs);
    return;
  }
  if (req.method === 'POST') {
    const job = await createJobDraft();
    res.status(200).json(job);
    return;
  }
  res.status(405).end();
}

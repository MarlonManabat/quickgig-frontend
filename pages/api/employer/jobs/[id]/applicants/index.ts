import type { NextApiRequest, NextApiResponse } from 'next';
import { getApplicants, ensureSeed } from '../../../../../../src/lib/employerStore';

const MODE = process.env.ENGINE_AUTH_MODE || 'mock';
const BASE = process.env.ENGINE_BASE_URL || '';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end();
  const { id = '' } = req.query as { id?: string };
  if (MODE === 'mock') {
    ensureSeed();
    return res.status(200).json(getApplicants(id));
  }
  try {
    const r = await fetch(`${BASE}/api/employer/jobs/${id}/applicants`, {
      headers: { cookie: req.headers.cookie || '' },
    });
    const data = await r.json().catch(() => ({}));
    res.status(r.status).json(data);
  } catch {
    res.status(500).json({ error: 'engine_error' });
  }
}

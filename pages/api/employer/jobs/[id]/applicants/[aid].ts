import type { NextApiRequest, NextApiResponse } from 'next';
import { setStatus, ensureSeed } from '../../../../../../src/lib/employerStore';

const MODE = process.env.ENGINE_AUTH_MODE || 'mock';
const BASE = process.env.ENGINE_BASE_URL || '';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id = '', aid = '' } = req.query as { id?: string; aid?: string };
  if (req.method !== 'PUT') return res.status(405).end();
  const { status } = req.body || {};
  if (MODE === 'mock') {
    ensureSeed();
    const updated = setStatus(id, aid, status);
    if (!updated) return res.status(404).end();
    return res.status(200).json(updated);
  }
  try {
    const r = await fetch(`${BASE}/api/employer/jobs/${id}/applicants/${aid}`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json', cookie: req.headers.cookie || '' },
      body: JSON.stringify({ status }),
    });
    const data = await r.json().catch(() => ({}));
    res.status(r.status).json(data);
  } catch {
    res.status(500).json({ error: 'engine_error' });
  }
}

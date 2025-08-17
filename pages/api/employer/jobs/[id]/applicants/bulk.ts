import type { NextApiRequest, NextApiResponse } from 'next';
import { bulkSetStatus, ensureSeed } from '../../../../../../src/lib/employerStore';

const MODE = process.env.ENGINE_AUTH_MODE || 'mock';
const BASE = process.env.ENGINE_BASE_URL || '';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id = '' } = req.query as { id?: string };
  if (req.method !== 'PUT') return res.status(405).end();
  const { ids = [], status } = req.body || {};
  if (MODE === 'mock') {
    ensureSeed();
    bulkSetStatus(id, ids, status);
    return res.status(200).json({ ok: true });
  }
  try {
    const r = await fetch(`${BASE}/api/employer/jobs/${id}/applicants/bulk`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json', cookie: req.headers.cookie || '' },
      body: JSON.stringify({ ids, status }),
    });
    const data = await r.json().catch(() => ({}));
    res.status(r.status).json(data);
  } catch {
    res.status(500).json({ error: 'engine_error' });
  }
}


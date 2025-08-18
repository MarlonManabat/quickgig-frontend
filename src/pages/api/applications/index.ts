import type { NextApiRequest, NextApiResponse } from 'next';
import { listApplications, seedMockApps } from '@/lib/applicantStore';

const MODE = process.env.ENGINE_MODE || 'mock';
const BASE = process.env.ENGINE_BASE_URL || '';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (MODE !== 'mock') {
    const r = await fetch(`${BASE}/api/applications`, {
      method: req.method,
      headers: { cookie: req.headers.cookie || '' },
    });
    const text = await r.text();
    res.status(r.status).send(text);
    return;
  }

  seedMockApps();
  if (req.method === 'GET') {
    const apps = await listApplications(req.headers.cookie);
    res.status(200).json(apps);
    return;
  }
  res.status(405).end();
}

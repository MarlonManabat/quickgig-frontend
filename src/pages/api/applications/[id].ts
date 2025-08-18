import type { NextApiRequest, NextApiResponse } from 'next';
import { getApplication, updateStatus, seedMockApps } from '@/lib/applicantStore';
import type { ApplicationStatus } from '@/types/application';

const MODE = process.env.ENGINE_MODE || 'mock';
const BASE = process.env.ENGINE_BASE_URL || '';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id } = req.query as { id: string };

  if (MODE !== 'mock') {
    const url = `${BASE}/api/applications/${id}`;
    const r = await fetch(url, {
      method: req.method,
      headers: { cookie: req.headers.cookie || '' },
      body: req.method === 'PATCH' ? JSON.stringify(req.body) : undefined,
    });
    const text = await r.text();
    res.status(r.status).send(text);
    return;
  }

  seedMockApps();
  if (req.method === 'GET') {
    const app = await getApplication(id, req.headers.cookie);
    if (!app) {
      res.status(404).end();
      return;
    }
    res.status(200).json(app);
    return;
  }
  if (req.method === 'PATCH') {
    const status = (req.body?.status || '') as ApplicationStatus;
    try {
      const updated = await updateStatus(id, status, req.headers.cookie);
      res.status(200).json(updated);
    } catch {
      res.status(400).json({ error: 'Unable to update' });
    }
    return;
  }
  res.status(405).end();
}

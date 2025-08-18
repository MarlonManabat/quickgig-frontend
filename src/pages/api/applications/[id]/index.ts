/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  getApplication,
  withdrawApplication,
  appendEvent,
  seedMockApps,
} from '@/lib/applicantStore';
import { get, patch, PATHS } from '@/lib/engine';

const throttle: Record<string, number> = {};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id } = req.query as { id: string };

  const fallbackGet = async () => {
    seedMockApps();
    return getApplication(id, req.headers.cookie);
  };

  if (req.method === 'GET') {
    try {
      const app = await get(PATHS.applications.update(id), req, fallbackGet);
      if (!app) {
        res.status(404).end();
        return;
      }
      res.status(200).json(app);
    } catch (err) {
      res.status((err as any).status || 500).json({ error: (err as any).message || 'engine error' });
    }
    return;
  }

  if (req.method === 'PATCH') {
    const ip = req.socket.remoteAddress || 'unknown';
    const last = throttle[ip] || 0;
    if (Date.now() - last < 10_000) {
      res.status(429).json({ error: 'Too many actions' });
      return;
    }
    throttle[ip] = Date.now();
    const { action, note, event } = req.body || {};
    try {
      const fallback = async () => {
        if (action === 'withdraw') {
          return withdrawApplication(id, note, req.headers.cookie);
        }
        if (event) {
          return appendEvent(id, event, req.headers.cookie);
        }
        throw new Error('Invalid action');
      };
      const data = await patch(PATHS.applications.update(id), req.body, req, fallback);
      res.status(200).json(data);
    } catch (err) {
      res.status(400).json({ error: (err as any).message || 'Unable to update' });
    }
    return;
  }

  res.status(405).end();
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from 'next';
import { engineFetch, withFallback, PATHS } from '@/lib/engine';

const mockJobs: Record<string, unknown> = {
  '1': { id: '1', title: 'Sample Job 1', company: 'Acme Corp', location: 'Manila' },
  '2': { id: '2', title: 'Sample Job 2', company: 'Globex', location: 'Cebu' },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query as { id: string };
  if (req.method !== 'GET') {
    res.status(405).end();
    return;
  }
  try {
    const data = await withFallback(
      () => engineFetch(PATHS.jobs.detail(id), { req }),
      async () => mockJobs[id] || null,
    );
    if (!data) {
      res.status(404).end();
      return;
    }
    res.status(200).json(data);
  } catch (err) {
    res.status((err as any).status || 500).json({ error: (err as any).message || 'engine error' });
  }
}

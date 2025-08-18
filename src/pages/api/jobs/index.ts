/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from 'next';
import { engineFetch, withFallback, PATHS } from '@/lib/engine';

const mockJobs = [
  { id: '1', title: 'Sample Job 1', company: 'Acme Corp', location: 'Manila' },
  { id: '2', title: 'Sample Job 2', company: 'Globex', location: 'Cebu' },
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).end();
    return;
  }
  const query = req.url?.split('?')[1] ? `?${req.url?.split('?')[1]}` : '';
  try {
    const data = await withFallback(
      () => engineFetch(PATHS.jobs.search + query, { req }),
      async () => mockJobs,
    );
    res.status(200).json(data);
  } catch (err) {
    res.status((err as any).status || 500).json({ error: (err as any).message || 'engine error' });
  }
}

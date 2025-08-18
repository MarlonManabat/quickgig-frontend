/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from 'next';
import { listApplications, seedMockApps } from '@/lib/applicantStore';
import { get, PATHS } from '@/lib/engine';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    res.status(405).end();
    return;
  }
  const fallback = async () => {
    seedMockApps();
    return listApplications(req.headers.cookie);
  };
  try {
    const apps = await get(PATHS.applications.list, req, fallback);
    res.status(200).json(apps);
  } catch (err) {
    res.status((err as any).status || 500).json({ error: (err as any).message || 'engine error' });
  }
}

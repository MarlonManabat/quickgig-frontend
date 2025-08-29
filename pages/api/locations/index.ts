import type { NextApiRequest, NextApiResponse } from 'next';
import { getRegions, getCitiesByRegion } from '@/lib/locations';

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  const regions = getRegions();
  const cities = regions.flatMap((r) => getCitiesByRegion(r.code));
  res.status(200).json({ regions, cities });
}

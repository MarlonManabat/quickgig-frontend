import type { NextApiRequest, NextApiResponse } from 'next';
import locations from '@/data/ph_locations.json';

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(locations);
}

import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '../../../src/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession(req);
  res.status(200).json({ session });
}

import type { NextApiRequest, NextApiResponse } from 'next';
import { BASE } from '../../../../lib/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const r = await fetch(`${BASE}/auth/me.php`, {
    headers: {
      cookie: req.headers.cookie || '',
    },
    credentials: 'include',
  });
  const data = await r.json();
  res.status(r.status).json(data);
}

import type { NextApiRequest, NextApiResponse } from 'next';
import { BASE } from '../../../../lib/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const r = await fetch(`${BASE}/orders/create.php`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      cookie: req.headers.cookie || '',
    },
    body: JSON.stringify(req.body),
  });
  const data = await r.json();
  res.status(r.status).json(data);
}

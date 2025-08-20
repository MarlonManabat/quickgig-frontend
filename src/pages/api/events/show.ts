import type { NextApiRequest, NextApiResponse } from 'next';
import { BASE } from '../../../../lib/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const query = req.url?.split('?')[1] ? `?${req.url.split('?')[1]}` : '';
  const r = await fetch(`${BASE}/events/show.php${query}`, {
    headers: { cookie: req.headers.cookie || '' },
  });
  const data = await r.json();
  res.status(r.status).json(data);
}

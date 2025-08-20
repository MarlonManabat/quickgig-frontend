import type { NextApiRequest, NextApiResponse } from 'next';
import { BASE } from '../../../../../lib/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const r = await fetch(`${BASE}/admin/events/update.php`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'X-Admin-Token': process.env.ADMIN_TOKEN || '',
    },
    body: JSON.stringify(req.body),
  });
  const data = await r.json();
  res.status(r.status).json(data);
}

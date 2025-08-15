import type { NextApiRequest, NextApiResponse } from 'next';
import { env } from '@/config/env';
import { API } from '@/config/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, message: 'Method not allowed' });
  }
  try {
    const r = await fetch(`${env.API_URL}${API.startConversation}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        cookie: req.headers.cookie || '',
      },
      body: JSON.stringify(req.body),
    });
    const data = await r.json().catch(() => ({}));
    res.status(r.status).json(data);
  } catch (err) {
    res.json({ ok: false, message: (err as Error).message });
  }
}

import type { NextApiRequest, NextApiResponse } from 'next';
import { UploadedFile } from '@/types/upload';

const MODE = process.env.ENGINE_MODE || 'mock';
const BASE = process.env.ENGINE_BASE_URL || '';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const { kind, file } = req.body as { kind: 'resume' | 'avatar'; file: UploadedFile };
    if (MODE === 'mock') {
      return res.status(200).json({ ok: true, id: file.id, url: `/api/upload/${file.id}` });
    }
    const r = await fetch(`${BASE}/upload`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ kind, file }),
    });
    const txt = await r.text();
    return res.status(r.status).send(txt);
  } catch {
    return res.status(500).json({ ok: false });
  }
}

import type { NextApiRequest, NextApiResponse } from 'next';
import { getApplicants, ensureSeed } from '../../../../../src/lib/employerStore';

const MODE = process.env.ENGINE_AUTH_MODE || 'mock';
const BASE = process.env.ENGINE_BASE_URL || '';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id = '' } = req.query as { id?: string };
  if (req.method !== 'GET') return res.status(405).end();
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  if (MODE === 'mock') {
    ensureSeed();
    const apps = getApplicants(id);
    const emails = Array.from(new Set(apps.map(a => a.email))).join(',');
    return res.status(200).send(emails);
  }
  try {
    const r = await fetch(`${BASE}/api/employer/jobs/${id}/emails.txt`, {
      headers: { cookie: req.headers.cookie || '' },
    });
    const txt = await r.text();
    res.status(r.status).send(txt);
  } catch {
    res.status(500).end();
  }
}


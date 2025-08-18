import type { NextApiRequest, NextApiResponse } from 'next';
import { getCompany, updateCompany } from '@/lib/employerStore';

const MODE = process.env.ENGINE_MODE || 'mock';
const BASE = process.env.ENGINE_BASE_URL || '';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (MODE !== 'mock') {
    const r = await fetch(`${BASE}/api/company`, {
      method: req.method,
      headers: { cookie: req.headers.cookie || '', 'content-type': 'application/json' },
      body: req.method === 'PATCH' ? JSON.stringify(req.body) : undefined,
    });
    const text = await r.text();
    res.status(r.status).send(text);
    return;
  }
  if (req.method === 'GET') {
    const company = await getCompany();
    res.status(200).json(company);
    return;
  }
  if (req.method === 'PATCH') {
    const updated = await updateCompany(req.body);
    res.status(200).json(updated);
    return;
  }
  res.status(405).end();
}

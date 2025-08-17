import type { NextApiRequest, NextApiResponse } from 'next';
import { listAlerts, upsertAlert } from '@/lib/alertsStore';
import type { JobAlert } from '@/types/alert';

const MODE = process.env.ENGINE_MODE;
const BASE = process.env.ENGINE_BASE_URL || '';

async function notify(alert: JobAlert) {
  const url = process.env.ALERTS_WEBHOOK_URL;
  if (!url) return;
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ type: 'alert_saved', alert, user: 'mock' }),
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('alert webhook', e);
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (MODE !== 'mock') {
    const url = `${BASE}/alerts`;
    const r = await fetch(url, {
      method: req.method,
      headers: { 'content-type': 'application/json', cookie: req.headers.cookie || '' },
      body: req.method === 'POST' ? JSON.stringify(req.body) : undefined,
    });
    const txt = await r.text();
    res.status(r.status).send(txt);
    return;
  }

  if (req.method === 'GET') {
    res.status(200).json(listAlerts());
    return;
  }
  if (req.method === 'POST') {
    const body = req.body as Partial<JobAlert>;
    const prev = body.id ? listAlerts().find((a) => a.id === body.id) : undefined;
    const saved = upsertAlert(body as Omit<JobAlert, 'id' | 'createdAt'> & { id?: string });
    if (!prev || prev.freq !== saved.freq) await notify(saved);
    res.status(200).json(saved);
    return;
  }
  res.status(405).end();
}

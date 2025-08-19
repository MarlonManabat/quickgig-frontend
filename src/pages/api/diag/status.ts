import type { NextApiRequest, NextApiResponse } from 'next';
import { BASE } from '../../../../lib/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end();
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);
  const baseUrl = BASE.replace(/\/$/, '');
  try {
    const r = await fetch(`${baseUrl}/status`, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    const backend = await r.json();
    return res.status(200).json({ ok: true, backend, baseUrl, time: new Date().toISOString() });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const cause =
      err instanceof Error && 'cause' in err && (err as { cause?: unknown }).cause
        ? String((err as { cause?: unknown }).cause)
        : undefined;
    return res
      .status(502)
      .json({ ok: false, error: { message, cause, baseUrl } });
  } finally {
    clearTimeout(timer);
  }
}

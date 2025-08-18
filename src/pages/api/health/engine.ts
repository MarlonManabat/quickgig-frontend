/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const base = process.env.ENGINE_BASE_URL;
  const start = Date.now();
  if (!base || process.env.ENGINE_MODE !== 'php') {
    res.status(200).json({ ok: true, latencyMs: 0 });
    return;
  }
  try {
    const r = await fetch(`${base}/_health`);
    const latencyMs = Date.now() - start;
    res.status(200).json({ ok: r.ok, latencyMs });
  } catch {
    const latencyMs = Date.now() - start;
    res.status(200).json({ ok: false, latencyMs });
  }
}

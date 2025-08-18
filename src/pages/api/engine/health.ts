/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from 'next';
import { engineFetch, isEngineOn } from '@/lib/engine';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!isEngineOn()) {
    res.status(200).json({ ok: true });
    return;
  }
  try {
    await engineFetch('/health', { req });
    res.status(200).json({ ok: true });
  } catch {
    res.status(200).json({ ok: false });
  }
}


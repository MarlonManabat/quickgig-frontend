/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from 'next';
import { env } from '@/config/env';
import { addClient, removeClient } from '@/lib/notificationsStore';

export const config = {
  runtime: 'nodejs',
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!req.cookies[env.JWT_COOKIE_NAME]) {
    res.status(401).end();
    return;
  }
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();
  addClient(res);
  req.on('close', () => {
    removeClient(res);
  });
}

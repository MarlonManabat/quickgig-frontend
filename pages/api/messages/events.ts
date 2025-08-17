import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@/lib/auth';
import { latestMessage, ensureThread, sendMessage } from '@/lib/messageStore';

export const config = { api: { bodyParser: false } };

const MODE = process.env.ENGINE_AUTH_MODE || 'mock';
const BASE = process.env.ENGINE_BASE_URL || '';
const POLL_MS = Number(process.env.EVENTS_POLL_MS || '5000');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getSession(req);
  if (!user) return res.status(401).end();

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });

  res.write('event: ready\n');
  res.write('data: {}\n\n');

  const ping = setInterval(() => {
    res.write(`event: ping\n`);
    res.write(`data: ${Date.now()}\n\n`);
  }, 15000);

  let watermark = 0;
  const poll = async () => {
    try {
      if (MODE === 'mock') {
        if (Math.random() < 0.1) {
          const t = ensureThread('demo', user.id);
          sendMessage(t, 'demo', user.id, 'Hello from mock');
        }
        const m = latestMessage(user.id);
        if (m) {
          const ts = Date.parse(m.createdAt);
          if (ts > watermark) {
            watermark = ts;
            res.write('event: message\n');
            res.write(`data: ${JSON.stringify(m)}\n\n`);
          }
        }
      } else {
        const r = await fetch(`${BASE}/api/messages?latest=1`, {
          headers: { cookie: req.headers.cookie || '' },
        });
        const j = await r.json().catch(() => ({}));
        const ts = j?.latest ? Date.parse(j.latest.createdAt) : 0;
        if (j?.latest && ts > watermark) {
          watermark = ts;
          const r2 = await fetch(`${BASE}/api/messages/${j.latest.threadId}`, {
            headers: { cookie: req.headers.cookie || '' },
          });
          const j2 = await r2.json().catch(() => ({}));
          const arr = j2.messages || [];
          const m = arr[arr.length - 1];
          if (m) {
            res.write('event: message\n');
            res.write(`data: ${JSON.stringify(m)}\n\n`);
          }
        }
      }
    } catch {
      // ignore
    }
  };

  const poller = setInterval(poll, POLL_MS);
  poll();

  req.on('close', () => {
    clearInterval(poller);
    clearInterval(ping);
  });
}

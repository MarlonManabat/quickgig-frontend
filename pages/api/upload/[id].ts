import type { NextApiRequest, NextApiResponse } from 'next';

const MODE = process.env.ENGINE_MODE || 'mock';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end();
  if (MODE === 'mock') {
    res.setHeader('content-type', 'text/plain');
    res.send('mock file');
    return;
  }
  res.status(404).end();
}

import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import type { UserSettings } from '@/types/settings';
import { sign, unsign } from '@/lib/signedCookie';
import { env } from '@/config/env';
import { defaults } from '@/app/settings/store';

const schema = z.object({
  lang: z.union([z.literal('en'), z.literal('tl')]),
  email: z.union([z.literal('ops_only'), z.literal('all'), z.literal('none')]),
  alerts: z.union([z.literal('daily'), z.literal('weekly')]),
  notifyEnabled: z.boolean(),
});

const COOKIE = 'settings_v1';

function readCookie(req: NextApiRequest) {
  const raw = req.cookies[COOKIE];
  if (!raw) return null;
  const val = unsign(raw);
  if (!val) return null;
  try {
    return schema.parse(JSON.parse(Buffer.from(val, 'base64').toString('utf8')));
  } catch {
    return null;
  }
}

function writeCookie(res: NextApiResponse, data: unknown) {
  const raw = Buffer.from(JSON.stringify(data)).toString('base64');
  const signed = sign(raw);
  res.setHeader('Set-Cookie', `${COOKIE}=${signed}; Path=/; HttpOnly; SameSite=Lax; Max-Age=31536000`);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') return handleGet(req, res);
  if (req.method === 'PUT') return handlePut(req, res);
  res.status(405).end();
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.ENGINE_MODE === 'php' && env.NEXT_PUBLIC_ENABLE_SETTINGS) {
    try {
      const r = await fetch(`${process.env.ENGINE_BASE_URL}/api/v1/settings`, {
        headers: { cookie: req.headers.cookie || '' },
      });
      if (r.ok) {
        const data = schema.parse(await r.json());
        writeCookie(res, data);
        res.status(200).json(data);
        return;
      }
    } catch {
      /* ignore */
    }
  }
  const data = readCookie(req) || defaults;
  writeCookie(res, data);
  res.status(200).json(data);
}

async function handlePut(req: NextApiRequest, res: NextApiResponse) {
  let body: unknown = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      body = null;
    }
  }
  let data: UserSettings;
  try {
    data = schema.parse(body);
  } catch {
    res.status(400).json({ ok: false });
    return;
  }
  if (process.env.ENGINE_MODE === 'php' && env.NEXT_PUBLIC_ENABLE_SETTINGS) {
    try {
      const r = await fetch(`${process.env.ENGINE_BASE_URL}/api/v1/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          cookie: req.headers.cookie || '',
        },
        body: JSON.stringify(data),
      });
      if (r.ok) {
        const j = schema.parse(await r.json());
        writeCookie(res, j);
        res.status(200).json(j);
        return;
      }
    } catch {
      /* ignore */
    }
  }
  writeCookie(res, data);
  res.status(200).json(data);
}

export const config = { api: { bodyParser: true } };

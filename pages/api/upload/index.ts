import type { NextApiRequest, NextApiResponse } from 'next';

// Prevent accidental client-side import
// (ts-expect-error because the package is ESM-only; the presence is enough to guard)
/* @ts-expect-error server-only */ import 'server-only';

import { hit } from '@/server/uploads/rateLimiter';
import { makeUploadKey } from '@/server/uploads/makeUploadKey';
import { logUpload } from '@/server/uploads/logger';
import { limit } from '@/server/rateLimit';

export const config = { api: { bodyParser: true } }; // simple JSON body

function parseCookies(cookieHeader?: string): Record<string, string> {
  const list: Record<string, string> = {};
  if (!cookieHeader) return list;
  cookieHeader.split(';').forEach((cookie) => {
    const parts = cookie.split('=');
    const key = parts.shift()?.trim();
    if (!key) return;
    const value = decodeURIComponent(parts.join('='));
    list[key] = value;
  });
  return list;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const ip = req.headers['x-forwarded-for']?.toString().split(',')[0] || req.socket.remoteAddress || '';
  try {
    if (process.env.NEXT_PUBLIC_ENABLE_S3_UPLOADS !== 'true') {
      return res.status(501).json({ ok: false, error: 'S3 uploads disabled' });
    }
    if (process.env.NEXT_PUBLIC_ENABLE_RATE_LIMITING === 'true') {
      const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS || 60000);
      const max = Number(process.env.RATE_LIMIT_MAX_PER_WINDOW || 60);
      const { ok, retryAfterSeconds } = limit({ key: ip, max, windowMs });
      if (!ok) {
        res.setHeader('Retry-After', String(retryAfterSeconds));
        return res.status(429).json({ error: 'rate_limited' });
      }
    }
    if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method Not Allowed' });

    const { name, type, size } = (typeof req.body === 'string' ? JSON.parse(req.body) : req.body) ?? {};
    if (!name || !type || typeof size !== 'number') {
      return res.status(400).json({ ok: false, error: 'missing_fields' });
    }

    const allow = String(process.env.ALLOWED_UPLOAD_MIME || '').split(',').map((s) => s.trim()).filter(Boolean);
    if (allow.length && !allow.includes(type)) {
      logUpload({ method: req.method, result: 'bad_type', type, size, ip });
      return res.status(400).json({ ok: false, error: 'bad_type' });
    }
    const maxMb = Number(process.env.NEXT_PUBLIC_MAX_UPLOAD_MB || 2);
    const maxBytes = maxMb * 1024 * 1024;
    if (size > maxBytes) {
      logUpload({ method: req.method, result: 'too_big', type, size, ip });
      return res.status(400).json({ ok: false, error: 'too_big', maxMb });
    }

    const cookies = parseCookies(req.headers.cookie);
    const user = cookies[process.env.JWT_COOKIE_NAME || 'auth_token'] || null;
    const rateKey = user || ip;
    if (!hit(rateKey)) {
      logUpload({ method: req.method, result: 'rate_limited', type, size, user, ip });
      return res.status(429).json({ error: 'rate_limited' });
    }

    const key = makeUploadKey(user, name);

    // Dynamic import keeps AWS SDK server-only
    const [{ S3Client, PutObjectCommand }, { getSignedUrl }] = await Promise.all([
      import('@aws-sdk/client-s3'),
      import('@aws-sdk/s3-request-presigner'),
    ]);

    const s3 = new S3Client({
      region: process.env.S3_REGION!,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
      },
    });

    const cmd = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET!,
      Key: key,
      ContentType: type,
    });

    const url = await getSignedUrl(s3, cmd, { expiresIn: 60 });
    logUpload({ method: req.method, result: 'ok', key, size, type, user, ip });
    return res.status(200).json({ ok: true, url, key, maxMb });
  } catch (e) {
    logUpload({ method: req.method, result: 'error', error: String(e), ip });
    return res.status(500).json({ ok: false, error: 'Upload presign failed' });
  }
}

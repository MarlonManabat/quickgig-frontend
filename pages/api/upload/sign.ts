import type { NextApiRequest, NextApiResponse } from 'next';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { AWS, MAX_UPLOAD_MB, ACCEPT_UPLOADS, UPLOADS_CONFIGURED } from '@/lib/env';
import { randomUUID } from 'crypto';

const EXT_TO_MIME: Record<string, string> = {
  pdf: 'application/pdf',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
};
const ALLOWED_MIME = ACCEPT_UPLOADS.map((e) => EXT_TO_MIME[e]).filter(Boolean);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { filename = '', contentType = '', size = 0 } = req.body as {
    filename?: string;
    contentType?: string;
    size?: number;
  };
  if (size > MAX_UPLOAD_MB * 1024 * 1024)
    return res.status(400).json({ ok: false, reason: 'too_big' });
  if (!ALLOWED_MIME.includes(contentType))
    return res.status(400).json({ ok: false, reason: 'bad_type' });
  if (!UPLOADS_CONFIGURED)
    return res.status(501).json({ ok: false, reason: 'not_configured' });
  const client = new S3Client({
    region: AWS.region,
    credentials: {
      accessKeyId: AWS.accessKeyId,
      secretAccessKey: AWS.secretAccessKey,
    },
  });
  const date = new Date();
  const ymd = date.toISOString().slice(0, 10).replace(/-/g, '');
  const safe = filename
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, '-')
    .replace(/-+/g, '-');
  const key = `uploads/${ymd}/${randomUUID()}-${safe}`;
  const command = new PutObjectCommand({
    Bucket: AWS.bucket,
    Key: key,
    ContentType: contentType,
    ACL: 'public-read',
  });
  const url = await getSignedUrl(client, command, { expiresIn: 300 });
  return res.status(200).json({ ok: true, url, key });
}

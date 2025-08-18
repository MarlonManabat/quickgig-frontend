import type { NextApiRequest, NextApiResponse } from 'next';

// Prevent accidental client-side import
// (ts-expect-error because the package is ESM-only; the presence is enough to guard)
/* @ts-expect-error server-only */ import 'server-only';

export const config = { api: { bodyParser: true } }; // simple JSON body

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (process.env.NEXT_PUBLIC_ENABLE_S3_UPLOADS !== 'true') {
      return res.status(501).json({ ok: false, error: 'S3 uploads disabled' });
    }
    if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method Not Allowed' });

    const { key, type } = (typeof req.body === 'string' ? JSON.parse(req.body) : req.body) ?? {};
    if (!key || !type) return res.status(400).json({ ok: false, error: 'Missing key/type' });

    const allow = String(process.env.ALLOWED_UPLOAD_MIME || '').split(',').map(s => s.trim()).filter(Boolean);
    if (allow.length && !allow.includes(type)) {
      return res.status(415).json({ ok: false, error: 'Unsupported media type' });
    }

    const maxMb = Number(process.env.NEXT_PUBLIC_MAX_UPLOAD_MB || 2);

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
    return res.status(200).json({ ok: true, url, maxMb });
  } catch {
    return res.status(500).json({ ok: false, error: 'Upload presign failed' });
  }
}

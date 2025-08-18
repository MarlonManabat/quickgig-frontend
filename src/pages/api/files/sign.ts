import type { NextApiRequest, NextApiResponse } from 'next';

const enabled = process.env.NEXT_PUBLIC_ENABLE_FILE_SIGNING === 'true';
const bucket = process.env.AWS_S3_BUCKET;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!enabled || !bucket) {
    res.status(404).end();
    return;
  }
  const key = req.query.key;
  if (!key || typeof key !== 'string') {
    res.status(400).json({ error: 'key required' });
    return;
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const reqFn: any = (global as any).require ? (global as any).require : eval('require');
    const { S3Client, GetObjectCommand } = reqFn('@aws-sdk/client-s3');
    const { getSignedUrl } = reqFn('@aws-sdk/s3-request-presigner');
    const client = new S3Client({ region: process.env.AWS_REGION || process.env.AWS_S3_REGION });
    const command = new GetObjectCommand({ Bucket: bucket, Key: key });
    const url = await getSignedUrl(client, command, { expiresIn: 60 });
    res.status(200).json({ url });
  } catch {
    res.status(404).end();
  }
}

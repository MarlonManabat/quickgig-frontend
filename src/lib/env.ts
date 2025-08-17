export const MAX_UPLOAD_MB = Number(process.env.NEXT_PUBLIC_MAX_UPLOAD_MB ?? 4);
export const ACCEPT_UPLOADS = (process.env.NEXT_PUBLIC_ACCEPT_UPLOADS || '')
  .split(',')
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

export const AWS = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  region: process.env.AWS_REGION || '',
  bucket: process.env.S3_BUCKET || '',
};

export const UPLOADS_CONFIGURED = Boolean(
  AWS.accessKeyId && AWS.secretAccessKey && AWS.region && AWS.bucket
);

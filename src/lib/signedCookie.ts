import crypto from 'crypto';

const SECRET = process.env.AUTH_SECRET || '';

export function sign(value: string): string {
  if (!SECRET) return value;
  const sig = crypto.createHmac('sha256', SECRET).update(value).digest('hex');
  return `${value}.${sig}`;
}

export function unsign(signed: string): string | null {
  if (!SECRET) return signed;
  const idx = signed.lastIndexOf('.');
  if (idx === -1) return null;
  const value = signed.slice(0, idx);
  const sig = signed.slice(idx + 1);
  const expected = crypto.createHmac('sha256', SECRET).update(value).digest('hex');
  return sig === expected ? value : null;
}


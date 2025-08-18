import crypto from 'crypto';

const SECRET = process.env.AUTH_SECRET || 'secret';

export function sign(payload: Record<string, unknown>): string {
  const json = JSON.stringify(payload);
  const b64 = Buffer.from(json).toString('base64url');
  const sig = crypto.createHmac('sha256', SECRET).update(b64).digest('hex');
  return `${b64}.${sig}`;
}

export function verify(token: string): Record<string, unknown> | null {
  try {
    const [b64, sig] = token.split('.');
    const expected = crypto.createHmac('sha256', SECRET).update(b64).digest('hex');
    if (sig !== expected) return null;
    const json = Buffer.from(b64, 'base64url').toString();
    const payload = JSON.parse(json) as Record<string, unknown>;
    const exp = (payload as { exp?: number }).exp;
    if (exp && Date.now() / 1000 > exp) return null;
    return payload;
  } catch {
    return null;
  }
}

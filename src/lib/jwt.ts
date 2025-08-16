import crypto from 'crypto';

const enc = (obj: unknown) =>
  Buffer.from(JSON.stringify(obj)).toString('base64url');
const dec = (s: string): Record<string, unknown> =>
  JSON.parse(Buffer.from(s, 'base64url').toString('utf8'));

export function signJwt(
  payload: Record<string, unknown>,
  secret: string,
  ttlSec = 60 * 60 * 24 * 7,
) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + ttlSec;
  const body = { ...payload, iat, exp };
  const h = enc(header);
  const b = enc(body);
  const sig = crypto
    .createHmac('sha256', secret)
    .update(`${h}.${b}`)
    .digest('base64url');
  return { token: `${h}.${b}.${sig}`, exp };
}

export function verifyJwt(token: string, secret: string) {
  const [h, b, s] = token.split('.');
  if (!h || !b || !s) return null;
  const expect = crypto
    .createHmac('sha256', secret)
    .update(`${h}.${b}`)
    .digest('base64url');
  if (expect !== s) return null;
  const body = dec(b) as { exp?: number } & Record<string, unknown>;
  if (!body?.exp || Date.now() / 1000 > body.exp) return null;
  return body;
}


export function guardRate(req: Request, max = 60, windowMs = 60_000) {
  if (process.env.NEXT_PUBLIC_ENABLE_RATE_LIMITING !== 'true') return null;
  const ip = (req.headers.get('x-forwarded-for') ?? 'ip:unknown').split(',')[0].trim();
  const key = `${new URL(req.url).pathname}:${ip}`;
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require('../lib/rateLimit').allow(key, max, windowMs)
    ? null
    : new Response('Too Many Requests', { status: 429 });
}

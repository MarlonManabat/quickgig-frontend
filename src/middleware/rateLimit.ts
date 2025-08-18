import { NextRequest, NextResponse } from 'next/server';

const requests = new Map<string, { count: number; ts: number }>();
const metrics = { count: 0, errors: 0, start: Date.now() };

function log() {
  const errRate = metrics.count ? metrics.errors / metrics.count : 0;
  // eslint-disable-next-line no-console
  console.log('[metrics]', { count: metrics.count, errors: metrics.errors, errRate });
}

export function getMetrics() {
  return { ...metrics, uptime: Date.now() - metrics.start };
}

export function rateLimit(req: NextRequest): NextResponse | null {
  metrics.count += 1;
  const ip = req.ip || 'unknown';
  const now = Date.now();
  const windowMs = 60 * 1000;
  const limit = 60;
  const entry = requests.get(ip) || { count: 0, ts: now };
  if (now - entry.ts > windowMs) {
    entry.count = 0;
    entry.ts = now;
  }
  entry.count += 1;
  requests.set(ip, entry);
  if (entry.count > limit) {
    metrics.errors += 1;
    log();
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }
  log();
  return null;
}

import { NextResponse } from 'next/server';
import { env } from '@/config/env';
import { getMetrics } from '@/middleware/rateLimit';

export function GET() {
  if (!env.NEXT_PUBLIC_ENABLE_SECURITY_AUDIT) {
    return NextResponse.json({ error: 'not found' }, { status: 404 });
  }
  const metrics = getMetrics();
  return NextResponse.json({ pong: true, uptime: metrics.uptime });
}

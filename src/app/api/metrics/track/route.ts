import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { env } from '@/config/env';
import { API } from '@/config/api';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const ua = req.headers.get('user-agent') || '';
    const ip = req.headers.get('x-forwarded-for') || req.ip || '';
    const fwd = await fetch(`${env.API_URL}${API.metricsTrack}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...body, ua, ip, secret: env.METRICS_SECRET }),
    });
    return NextResponse.json({ ok: fwd.ok }, { status: 200 });
  } catch {
    return NextResponse.json({ ok: true, skipped: 'backend' }, { status: 200 });
  }
}

export const GET = POST;

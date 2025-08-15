import { NextResponse } from 'next/server';
import { env } from '@/config/env';
import { API } from '@/config/api';

export async function POST() {
  try {
    const body = { secret: process.env.ALERTS_DIGEST_SECRET || '' };
    if (API.alertsRunDigest) {
      const r = await fetch(`${env.API_URL}${API.alertsRunDigest}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const ok = r.ok;
      return NextResponse.json({ ok, mode: 'backend', status: r.status });
    }
    return NextResponse.json({ ok: true, mode: 'noop' });
  } catch {
    return NextResponse.json({ ok: false, error: 'cron-failed' }, { status: 200 });
  }
}

export const GET = POST;

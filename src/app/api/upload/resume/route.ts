import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/config/env';
import { API } from '@/config/api';
import { guardRate } from '@/lib/guardRate';

async function forward(req: NextRequest, target: string) {
  try {
    const form = await req.formData();
    const res = await fetch(`${env.API_URL}${target}`, {
      method: 'POST',
      body: form,
      headers: {
        cookie: req.headers.get('cookie') || '',
      },
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      return NextResponse.json({ ok: true, url: data.url || data.path });
    }
    return NextResponse.json({ ok: false, message: data.message || 'Upload failed' });
  } catch (err) {
    return NextResponse.json({ ok: false, message: (err as Error).message });
  }
}

export async function POST(req: NextRequest) {
  const guard = guardRate(
    req,
    Number(process.env.RATE_LIMIT_MAX_PER_WINDOW) || 60,
    Number(process.env.RATE_LIMIT_WINDOW_MS) || 60_000,
  );
  if (guard) return guard;
  return forward(req, API.uploadResume);
}

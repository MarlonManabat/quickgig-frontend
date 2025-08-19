import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/config/env';
import { API } from '@/config/api';

async function forward(req: NextRequest, target: string) {
  try {
    const form = await req.formData();
    const res = await fetch(`${env.API_URL!}${target}`, {
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
  return forward(req, API.uploadResume);
}

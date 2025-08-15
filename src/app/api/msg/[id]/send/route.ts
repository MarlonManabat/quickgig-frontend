import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/config/env';
import { API } from '@/config/api';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.text();
    const res = await fetch(`${env.API_URL}${API.sendMessage(params.id)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        cookie: req.headers.get('cookie') || '',
      },
      body,
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json({ ok: false, message: (err as Error).message });
  }
}

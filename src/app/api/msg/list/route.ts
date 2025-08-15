import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/config/env';
import { API } from '@/config/api';

export async function GET(req: NextRequest) {
  try {
    const res = await fetch(`${env.API_URL}${API.conversationsMine}`, {
      headers: {
        cookie: req.headers.get('cookie') || '',
      },
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json({ ok: false, message: (err as Error).message });
  }
}

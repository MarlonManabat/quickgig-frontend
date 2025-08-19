import { NextResponse } from 'next/server';
import { env } from '@/config/env';
import { API } from '@/config/api';

export async function GET() {
  try {
    const r = await fetch(`${env.apiUrl}${API.conversationsMine}`, { credentials: 'include' });
    const json = await r.json().catch(() => ({}));
    return NextResponse.json(json, { status: 200 });
  } catch {
    return NextResponse.json({ ok: false, items: [] }, { status: 200 });
  }
}

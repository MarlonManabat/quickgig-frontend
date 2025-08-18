import { NextResponse } from 'next/server';
import { env } from '@/config/env'; import { API } from '@/config/api';

export async function GET() {
  try {
    const r = await fetch(`${env.API_URL}${API.me}`, { headers: { 'Content-Type': 'application/json' } });
    const data = await r.json().catch(() => ({}));
    return NextResponse.json({ ok: r.ok, ...data }, { status: 200 });
  } catch { return NextResponse.json({ ok:false }, { status:200 }); }
}

import { NextResponse } from 'next/server';
import { meUpstream } from '@/lib/gateway';

export async function GET() {
  const res = await meUpstream();
  if (!res.ok) {
    if (res.status === 401) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }
    const msg = await safeMessage(res);
    return NextResponse.json({ ok: false, message: msg }, { status: res.status });
  }
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data);
}

async function safeMessage(r: Response) {
  try { const j = await r.json(); return j?.message ?? r.statusText; } catch { return r.statusText; }
}

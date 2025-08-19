import { NextResponse } from 'next/server';
import { registerUpstream } from '@/lib/gateway';

export async function POST(req: Request) {
  const body = await req.json();
  const res = await registerUpstream(body);
  if (res.status === 201) {
    return NextResponse.json({ ok: true }, { status: 201 });
  }
  const msg = await safeMessage(res);
  return NextResponse.json({ ok: false, message: msg }, { status: res.status });
}

async function safeMessage(r: Response) {
  try { const j = await r.json(); return j?.message ?? r.statusText; } catch { return r.statusText; }
}

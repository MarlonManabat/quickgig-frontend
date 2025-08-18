import { NextResponse } from 'next/server';
import { env } from '@/config/env';
import { API } from '@/config/api';
import { guardRate } from '@/lib/guardRate';

export async function POST(req: Request, ctx: { params: { id: string } }) {
  const guard = guardRate(
    req,
    Number(process.env.RATE_LIMIT_MAX_PER_WINDOW) || 60,
    Number(process.env.RATE_LIMIT_WINDOW_MS) || 60_000,
  );
  if (guard) return guard;
  try {
    const body = await req.json().catch(() => ({}));
    const r = await fetch(`${env.API_URL}${API.sendMessage(ctx.params.id)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      credentials: 'include',
    });
    const json = await r.json().catch(() => ({}));
    return NextResponse.json(json, { status: 200 });
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}

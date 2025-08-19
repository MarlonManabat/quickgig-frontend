import { NextResponse } from 'next/server';
import { env } from '@/config/env';
import { API } from '@/config/api';

export async function POST(_: Request, ctx: { params: { id: string } }) {
  try {
    const r = await fetch(`${env.API_URL!}${API.markConversationRead(ctx.params.id)}`, {
      method: 'POST',
      credentials: 'include',
    });
    const json = await r.json().catch(() => ({}));
    return NextResponse.json(json, { status: 200 });
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}

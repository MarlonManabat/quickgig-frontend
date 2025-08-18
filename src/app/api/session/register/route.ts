import { NextResponse } from 'next/server';
import { env } from '@/config/env';
import { API } from '@/config/api';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  try {
    const r = await fetch(`${env.API_URL}${API.register}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    });
    const data = await r.json().catch(() => ({}));
    return NextResponse.json(
      r.ok ? { ok: true, ...data } : { ok: false, message: data?.message || 'Registration failed' },
      { status: 200 }
    );
  } catch { return NextResponse.json({ ok:false, message:'Auth service unreachable' }, { status:200 }); }
}

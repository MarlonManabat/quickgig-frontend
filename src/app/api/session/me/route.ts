import { NextResponse } from 'next/server';
const GATE = process.env.NEXT_PUBLIC_GATE_ORIGIN || 'https://api.quickgig.ph';

export async function GET() {
  const r = await fetch(`${GATE}/session/me`, {
    cache: 'no-store',
    credentials: 'include' as RequestCredentials,
  });
  if (!r.ok) return NextResponse.json({ ok: false }, { status: r.status });
  const data = await r.json().catch(() => ({}));
  return NextResponse.json(data);
}

import { NextResponse } from 'next/server';

// Never cache; always compute a fresh timestamp
export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({ ok: true, ts: new Date().toISOString() });
}

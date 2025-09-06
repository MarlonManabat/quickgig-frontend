import { NextResponse } from 'next/server';
import { ensureSignupBonus, getTicketBalance } from '@/lib/tickets';
import supabaseServer from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export async function GET() {
  try {
    const supa = supabaseServer();
    if (!supa) {
      return NextResponse.json(
        { error: 'server_not_configured' },
        { status: 503 },
      );
    }
    // Award free tickets once per user (idempotent), then return balance
    await ensureSignupBonus();
    const balance = await getTicketBalance();
    return NextResponse.json({ balance });
  } catch (e: any) {
    if (e?.message?.includes('Server not configured')) {
      return NextResponse.json(
        { error: 'server_not_configured' },
        { status: 503 },
      );
    }
    return NextResponse.json({ error: e?.message ?? 'error' }, { status: 400 });
  }
}

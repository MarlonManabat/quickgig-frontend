import { NextResponse } from 'next/server';
import { userIdFromCookie } from '@/lib/supabase/server';
import { getTicketBalance } from '@/lib/tickets';

export const dynamic = 'force-dynamic';

export async function GET() {
  const uid = await userIdFromCookie();
  if (!uid) return NextResponse.json({ balance: 0 });
  const bal = await getTicketBalance(uid);
  return NextResponse.json({ balance: bal });
}


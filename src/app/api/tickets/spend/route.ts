import { NextResponse } from 'next/server';
import { z } from 'zod';
import { spendOneTicket, getTicketBalance } from '@/lib/tickets';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

const Body = z.object({
  amount: z.number().int().positive().default(1),
  reason: z.string().max(100).default('spend'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const parsed = Body.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: 'bad_request' }, { status: 400 });
    }
    const { amount, reason } = parsed.data;
    for (let i = 0; i < amount; i++) {
      await spendOneTicket(reason, { i });
    }
    const balance = await getTicketBalance();
    return NextResponse.json({ ok: true, balance });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? 'error' }, { status: 400 });
  }
}

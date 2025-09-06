import { NextResponse } from 'next/server';
import { z } from 'zod';
import { spendOneTicket, getTicketBalance } from '@/lib/tickets';
import { userIdFromCookie } from '@/lib/supabase/server';
import {
  assertUserCanConfirmAgreement,
  confirmAgreementSide,
} from '@/lib/agreements';

const Params = z.object({ id: z.string().uuid().or(z.string().min(1)) });

export async function POST(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const parse = Params.safeParse(params);
  if (!parse.success)
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

  const userId = await userIdFromCookie();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const agreementId = parse.data.id;

  try {
    const { agreement, role, already } = await assertUserCanConfirmAgreement(
      agreementId,
      userId,
    );
    if (already) {
      const bal = await getTicketBalance();
      return NextResponse.json({ ok: true, balance: bal, agreement });
    }

    const bal = await getTicketBalance();
    if (bal < 1) {
      return NextResponse.json(
        { error: 'INSUFFICIENT_TICKETS' },
        { status: 402 },
      );
    }

    const newBal = await spendOneTicket('agreement_burn', {
      agreementId,
      role,
    });

    const updated = await confirmAgreementSide(agreementId, role);

    return NextResponse.json({ ok: true, balance: newBal, agreement: updated });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? 'Failed to confirm' },
      { status: 409 },
    );
  }
}

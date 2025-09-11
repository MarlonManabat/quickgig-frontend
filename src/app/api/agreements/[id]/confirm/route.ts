import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { getClient, getAdminClient } from '@/lib/supabase';

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const user = await requireUser();
  const db = getClient();

  const { data: agreement, error: fetchErr } = await db
    .from('agreements')
    .select('id, status, employer_id, amount')
    .eq('id', id)
    .maybeSingle();

  if (fetchErr) return NextResponse.json({ ok: false, error: fetchErr.message }, { status: 400 });
  if (!agreement) return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });

  if (user.id !== agreement.employer_id) {
    return NextResponse.json({ ok: false, error: 'forbidden' }, { status: 403 });
  }

  if (agreement.status === 'agreed') {
    return NextResponse.json({ ok: true, alreadyConfirmed: true }, { status: 200 });
  }

  const admin = getAdminClient();
  const { error: debitErr } = await admin!.rpc('tickets_debit', {
    employer_id: agreement.employer_id,
    agreement_id: agreement.id,
    amount: agreement.amount ?? 0,
  });
  if (debitErr) {
    return NextResponse.json({ ok: false, error: debitErr.message }, { status: 400 });
  }

  const { error: updErr } = await db
    .from('agreements')
    .update({ status: 'agreed' })
    .eq('id', id)
    .eq('status', 'pending');

  if (updErr) {
    return NextResponse.json({ ok: false, error: updErr.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}

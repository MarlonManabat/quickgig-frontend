import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { getAdminClient } from '@/lib/supabase';

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const { user } = await requireUser();
  const id = params.id;
  const admin = await getAdminClient();

  const { data: agreement, error: getErr } = await admin
    .from('agreements')
    .select('id, status, employer_id, amount')
    .eq('id', id)
    .maybeSingle();

  if (getErr) {
    return NextResponse.json({ ok: false, error: getErr.message }, { status: 400 });
  }
  if (!agreement) {
    return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
  }
  if (agreement.employer_id !== user.id) {
    return NextResponse.json({ ok: false, error: 'forbidden' }, { status: 403 });
  }
  if (agreement.status === 'agreed') {
    return NextResponse.json({ ok: true, alreadyConfirmed: true }, { status: 200 });
  }
  if (agreement.status !== 'pending') {
    return NextResponse.json({ ok: false, error: 'invalid_status' }, { status: 409 });
  }

  const { error: debitErr } = await admin.rpc('tickets_debit', {
    employer_id: agreement.employer_id,
    agreement_id: agreement.id,
    amount: agreement.amount ?? 0,
  });
  if (debitErr) {
    return NextResponse.json({ ok: false, error: debitErr.message }, { status: 402 });
  }

  const { error: updErr } = await admin
    .from('agreements')
    .update({ status: 'agreed' })
    .eq('id', id)
    .eq('status', 'pending');
  if (updErr) {
    return NextResponse.json({ ok: false, error: updErr.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true, id }, { status: 200 });
}

import { NextResponse } from 'next/server';
import { getServerSupabase, getAdminClient } from '@/lib/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const id = params.id;

  const supa = getServerSupabase();

  const { data: userRes } = await supa.auth.getUser();
  const me = userRes?.user?.id;
  if (!me) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });

  // Load agreement; only participants (or admin via SRK path below) may cancel.
  const { data: ag, error: agErr } = await supa
    .from('agreements')
    .select('id, employer_id, seeker_id, status')
    .eq('id', id)
    .single();

  if (agErr || !ag) return NextResponse.json({ ok: false, error: 'agreement_not_found' }, { status: 404 });
  if (me !== ag.employer_id && me !== ag.seeker_id) {
    return NextResponse.json({ ok: false, error: 'forbidden' }, { status: 403 });
  }

  // Only refund if previously agreed (burn happened).
  if (ag.status !== 'agreed') {
    return NextResponse.json({ ok: false, error: 'not_agreed' }, { status: 409 });
  }

  // Flip status first so UI reflects cancellation even if refund fails later.
  const { error: upErr } = await supa.from('agreements').update({ status: 'cancelled' }).eq('id', ag.id);
  if (upErr) return NextResponse.json({ ok: false, error: 'update_failed', detail: upErr.message }, { status: 500 });

  // Admin RPC call for refund
  const admin = await getAdminClient();

  const { data: refund, error: refundErr } = await admin.rpc('tickets_agreement_refund', {
    p_employer: ag.employer_id,
    p_seeker: ag.seeker_id,
    p_agreement: ag.id,
  });

  if (refundErr) {
    // Leave status as 'cancelled'; surface the error for support.
    return NextResponse.json({ ok: false, error: 'refund_failed', detail: refundErr.message }, { status: 400 });
  }

  const { data: updated } = await supa
    .from('agreements')
    .select('id, status')
    .eq('id', ag.id)
    .single();

  return NextResponse.json({ ok: true, refund, agreement: updated }, { status: 200 });
}

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { debit as ticketsDebit } from '@/lib/tickets';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const id = params.id;

  const cookieStore = cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const db = createServerClient(url, anon, { cookies: () => cookieStore });

  const { data: session } = await db.auth.getUser();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  const { data: agreement, error: loadErr } = await db
    .from('agreements')
    .select('id, employer_id, seeker_id, status, amount')
    .eq('id', id)
    .single();

  if (loadErr || !agreement) {
    return NextResponse.json({ ok: false, error: 'agreement_not_found' }, { status: 404 });
  }

  if (userId !== agreement.employer_id && userId !== agreement.seeker_id) {
    return NextResponse.json({ ok: false, error: 'forbidden' }, { status: 403 });
  }

  const { data: updated, error: updateErr } = await db
    .from('agreements')
    .update({ status: 'confirmed', confirmed_at: new Date().toISOString() })
    .eq('id', id)
    .eq('status', 'pending')
    .select()
    .maybeSingle();

  if (updateErr) {
    return NextResponse.json({ ok: false, error: updateErr.message }, { status: 400 });
  }

  const newlyConfirmed = !!updated;
  if (newlyConfirmed) {
    await ticketsDebit(db, agreement.employer_id, agreement.amount ?? 0, {
      agreementId: id,
    });
  }

  return NextResponse.json({
    ok: true,
    status: newlyConfirmed ? 'confirmed' : 'already-confirmed',
  });
}

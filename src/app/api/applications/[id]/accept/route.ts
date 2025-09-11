import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { getAdminClient } from '@/lib/supabase';

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const { user } = await requireUser();
  const admin = await getAdminClient();

  const { data: app, error } = await admin
    .from('applications')
    .select('id, employer_id, seeker_id, amount')
    .eq('id', params.id)
    .maybeSingle();

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  if (!app) return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
  if (app.employer_id !== user.id)
    return NextResponse.json({ ok: false, error: 'forbidden' }, { status: 403 });

  const { data, error: insErr } = await admin
    .from('agreements')
    .insert({
      application_id: app.id,
      employer_id: app.employer_id,
      seeker_id: app.seeker_id,
      amount: app.amount ?? 0,
      status: 'pending',
    })
    .select('id')
    .maybeSingle();

  if (insErr)
    return NextResponse.json({ ok: false, error: insErr.message }, { status: 400 });

  return NextResponse.json({ id: data!.id }, { status: 201 });
}

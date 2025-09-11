import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { getClient } from '@/lib/supabase';
import { createAgreementFromApplication } from '@/lib/agreements';

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const user = await requireUser();
  const db = getClient();

  const { data: app, error } = await db
    .from('applications')
    .select('id, employer_id')
    .eq('id', params.id)
    .eq('employer_id', user.id)
    .maybeSingle();

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  if (!app) return NextResponse.json({ ok: false, error: 'forbidden' }, { status: 403 });

  const { id, error: createErr } = await createAgreementFromApplication(app.id, user.id);
  if (createErr) return NextResponse.json({ ok: false, error: createErr }, { status: 400 });

  return NextResponse.json({ id }, { status: 201 });
}

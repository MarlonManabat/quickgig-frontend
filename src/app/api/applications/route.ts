import { NextResponse } from 'next/server';
import { adminSupabase, userIdFromCookie } from '@/lib/supabase/server';
import type { GigApplicationInsert } from '@/types/db';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: Request) {
  const uid = await userIdFromCookie();
  if (!uid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supa = await adminSupabase();
  if (!supa)
    return NextResponse.json(
      { ok: false, error: 'service disabled in preview' },
      { status: 501 }
    );

  const body = await req.json();
  const gigId = body.gig_id;
  if (!gigId) return NextResponse.json({ error: 'gig_id required' }, { status: 400 });

  const { data: existing, error: existErr } = await supa
    .from('gig_applications')
    .select('id')
    .eq('gig_id', gigId)
    .eq('applicant', uid)
    .maybeSingle();
  if (existErr) return NextResponse.json({ error: existErr.message }, { status: 500 });
  if (existing) return NextResponse.json({ error: 'Already applied' }, { status: 409 });

  const payload: GigApplicationInsert = {
    gig_id: gigId,
    applicant: uid,
    cover_letter: body.cover_letter ?? null,
  };
  const { error } = await supa.from('gig_applications').insert(payload);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}

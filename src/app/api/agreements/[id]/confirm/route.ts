import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { getAdminClient } from '@/lib/supabase/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const agreementId = params.id;

  // 1) Identify requester (must be one of the parties)
  const cookieStore = cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supa = createServerClient(url, anon, { cookies: () => cookieStore });

  const { data: session } = await supa.auth.getUser();
  const me = session?.user?.id;
  if (!me) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  // 2) Load agreement and participants (adjust table/columns if needed)
  const { data: ag, error: agErr } = await supa
    .from('agreements')
    .select('id, employer_id, seeker_id, status')
    .eq('id', agreementId)
    .single();

  if (agErr || !ag) {
    return NextResponse.json({ ok: false, error: 'agreement_not_found' }, { status: 404 });
  }

  if (ag.status === 'agreed') {
    return NextResponse.json({ ok: true, already: true }, { status: 200 });
  }

  if (me !== ag.employer_id && me !== ag.seeker_id) {
    return NextResponse.json({ ok: false, error: 'forbidden' }, { status: 403 });
  }

  // 3) Mark agreement agreed (domain logic)
  const { error: upErr } = await supa.from('agreements').update({ status: 'agreed' }).eq('id', ag.id);
  if (upErr) {
    return NextResponse.json({ ok: false, error: 'update_failed', detail: upErr.message }, { status: 500 });
  }

  // 4) Atomic ticket burn for both sides (admin RPC)
  const admin = getAdminClient();
  if (!admin) {
    return NextResponse.json({ ok: false, error: 'server_not_configured' }, { status: 503 });
  }

  const { data: burn, error: burnErr } = await admin.rpc('tickets_agreement_spend', {
    p_employer: ag.employer_id,
    p_seeker: ag.seeker_id,
    p_agreement: ag.id,
  });

  if (burnErr) {
    // Best-effort rollback of status if burn fails
    await admin.from('agreements').update({ status: 'pending' }).eq('id', ag.id);
    return NextResponse.json({ ok: false, error: 'burn_failed', detail: burnErr.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true, burn }, { status: 200 });
}

import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const supa = supabaseServer();
  if (!supa) return NextResponse.json({ error: 'service unavailable' }, { status: 503 });
  const { data: auth } = await supa.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { error } = await supa
    .from('jobs')
    .update({ status: 'published' })
    .eq('id', params.id);

  if (error) {
    const status = /rls/i.test(error.message) ? 403 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
  return NextResponse.json({ ok: true });
}

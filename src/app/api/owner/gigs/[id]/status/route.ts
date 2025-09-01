import { NextResponse } from 'next/server';
import { adminSupabase } from '@/lib/supabase/server';
import { setGigStatus } from '@/lib/mock/owner';

export const runtime = 'nodejs';

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const status = body?.status;
  if (status !== 'open' && status !== 'closed') {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }
  const gigId = params.id;
  const uid = 'stub-owner';
  const supa = await adminSupabase();
  if (!supa) {
    const ok = setGigStatus(gigId, status);
    if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ ok: true, status });
  }
  try {
    const { error } = await supa
      .from('gigs')
      .update({ status })
      .eq('id', gigId)
      .eq('owner', uid);
    if (error) throw error;
    return NextResponse.json({ ok: true, status });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message || 'Unexpected error' },
      { status: 500 },
    );
  }
}

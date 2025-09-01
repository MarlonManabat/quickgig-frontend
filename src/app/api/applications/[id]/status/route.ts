import { NextResponse } from 'next/server';
import { adminSupabase } from '@/lib/supabase/server';
import { setApplicationStatus } from '@/lib/mock/owner';
import type { AppStatus } from '@/types/owner';

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
  const status = body?.status as AppStatus;
  if (status !== 'accepted' && status !== 'rejected') {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }
  const appId = params.id;
  const supa = await adminSupabase();
  if (!supa) {
    const ok = setApplicationStatus(appId, status);
    if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ ok: true, status });
  }
  try {
    const { error } = await supa
      .from('gig_applications')
      .update({ status })
      .eq('id', appId);
    if (error) throw error;
    return NextResponse.json({ ok: true, status });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message || 'Unexpected error' },
      { status: 500 },
    );
  }
}

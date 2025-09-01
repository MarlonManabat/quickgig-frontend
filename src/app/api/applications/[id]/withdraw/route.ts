export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { userIdFromCookie, adminSupabase } from '@/lib/supabase/server';

export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const uid = await userIdFromCookie();
  if (!uid) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });

  const admin = await adminSupabase?.();
  if (!admin) {
    // still “successful” UX-wise, just no-op in preview without secrets
    return NextResponse.json(
      { ok: false, error: 'write not available in this environment' },
      { status: 501 }
    );
  }

  // Only allow withdrawing user’s own application
  const { error } = await admin
    .from('applications')
    .update({ status: 'withdrawn' })
    .eq('id', params.id)
    .eq('user_id', uid)
    .in('status', ['submitted', 'viewed', 'interviewing']);

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}

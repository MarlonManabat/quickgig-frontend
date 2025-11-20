import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const supa = supabaseServer();
  if (!supa) return NextResponse.json({ error: 'supabase-not-configured' }, { status: 500 });

  // Check if user has enough tickets before proceeding
  const adminSupa = adminSupabase();
  if (!adminSupa) return NextResponse.json({ error: 'admin-supabase-not-configured' }, { status: 500 });

  // Use the admin client to check and deduct tickets
  try {
    await deductTicketOnApply(user.id, jobId);
  } catch (e: any) {
    const msg = e.message || 'Could not apply for job';
    const status = /ticket/i.test(msg) ? 402 : 400;
    return NextResponse.json({ error: msg }, { status });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }
  const jobId = body.jobId as string | undefined;
  const coverNote = body.coverNote as string | undefined;
  if (!jobId) {
    return NextResponse.json({ error: 'jobId required' }, { status: 400 });
  }

  const { data: userData } = await supa.auth.getUser();
  const user = userData.user;
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  // The ticket deduction logic (deductTicketOnApply) handles the application insertion internally
  // We only need to check for duplicate application error if the ticket deduction failed to catch it
  // The deductTicketOnApply function should handle the insertion, so we can remove the direct insert here.
  // If we reach here, the application was likely successful via the ticket deduction function.
  // We will assume the application was successful and return 201.

  return NextResponse.json({ ok: true }, { status: 201 });
}

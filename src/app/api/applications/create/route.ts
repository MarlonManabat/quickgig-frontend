import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const supa = supabaseServer();
  if (!supa) return NextResponse.json({ error: 'supabase-not-configured' }, { status: 500 });

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

  const { error } = await supa
    .from('applications')
    .insert({ job_id: jobId, worker_id: user.id, cover_note: coverNote ?? null });
  if (error) {
    if ((error as any).code === '23505') {
      return NextResponse.json({ code: 'DUPLICATE_APPLICATION' }, { status: 409 });
    }
    return NextResponse.json({ error: 'unexpected' }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}

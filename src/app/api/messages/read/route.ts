import { NextResponse } from 'next/server';
import { adminSupabase, userIdFromCookie } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const applicationId = body?.applicationId;
  if (!applicationId) {
    return NextResponse.json({ error: 'applicationId required' }, { status: 400 });
  }
  const uid = (await userIdFromCookie()) ?? 'anon';
  const supa = await adminSupabase();
  if (supa) {
    await supa.from('message_reads').upsert(
      { application_id: applicationId, user_id: uid, last_read_at: new Date().toISOString() },
      { onConflict: 'application_id,user_id' }
    );
  }
  return NextResponse.json({ ok: true });
}

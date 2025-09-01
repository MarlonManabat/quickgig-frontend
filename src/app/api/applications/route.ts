import { NextResponse } from 'next/server';
import { adminSupabase, userIdFromCookie } from '@/lib/supabase/server';
import { apply as mockApply } from '@/lib/mock/gigs';
import type {
  ApplicationRequest,
  ApplicationResponse,
} from '@/types/applications';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  let body: ApplicationRequest;
  try {
    body = (await req.json()) as ApplicationRequest;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  if (!body.gig_id) {
    return NextResponse.json({ error: 'gig_id required' }, { status: 400 });
  }

  const supa = await adminSupabase();
  const userId = (await userIdFromCookie()) ?? 'anon';

  if (!supa) {
    const res = mockApply(body.gig_id);
    return NextResponse.json({ id: res.id, status: res.status });
  }

  try {
    const { data, error } = await supa
      .from('applications')
      .insert({ user_id: userId, gig_id: body.gig_id, status: 'submitted' })
      .select('id,status')
      .single();
    if (error) throw error;
    return NextResponse.json(data as ApplicationResponse);
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message || 'Unexpected error' },
      { status: 500 },
    );
  }
}

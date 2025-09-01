import { NextResponse } from 'next/server';
import { adminSupabase, userIdFromCookie } from '@/lib/supabase/server';
import { apply as mockApply } from '@/lib/mock/gigs';
import { list as mockList } from '@/lib/mock/applications';
import type { Application, ApplicationCreateResponse } from '@/types/applications';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const supa = await adminSupabase();
  const uid = (await userIdFromCookie()) ?? 'anon';

  if (!supa) {
    const applications = mockList(uid);
    return NextResponse.json({ applications });
  }

  try {
    const { data, error } = await supa
      .from('applications')
      .select('*')
      .eq('user_id', uid)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return NextResponse.json({ applications: (data as Application[]) ?? [] });
  } catch {
    return NextResponse.json({ applications: [] });
  }
}

export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  if (!body.gig_id) {
    return NextResponse.json({ error: 'gig_id required' }, { status: 400 });
  }
  const userId = typeof body.user_id === 'string' && body.user_id ? body.user_id : 'anon';

  const supa = await adminSupabase();

  if (!supa) {
    const res = mockApply(body.gig_id);
    return NextResponse.json({ id: res.id, status: res.status }, { status: 201 });
  }

  try {
    const { data, error } = await supa
      .from('gig_applications')
      .insert({ gig_id: body.gig_id, applicant: userId, status: 'submitted' })
      .select('id,status')
      .single();
    if (error) throw error;
    return NextResponse.json(data as ApplicationCreateResponse, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message || 'Unexpected error' },
      { status: 500 },
    );
  }
}

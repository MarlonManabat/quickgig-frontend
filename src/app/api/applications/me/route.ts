import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const supa = supabaseServer();
  if (!supa) return NextResponse.json({ applications: [] });

  const { data: userData } = await supa.auth.getUser();
  const user = userData.user;
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { data, error } = await supa
    .from('applications')
    .select('id, status, created_at, jobs(id,title)')
    .eq('worker_id', user.id)
    .order('created_at', { ascending: false });
  if (error) return NextResponse.json({ applications: [] });

  const applications = (data ?? []).map((a: any) => ({
    id: a.id,
    status: a.status,
    created_at: a.created_at,
    job: { id: a.jobs?.id, title: a.jobs?.title }
  }));

  return NextResponse.json({ applications });
}

import { NextResponse } from 'next/server';
import { adminSupabase, userIdFromCookie } from '@/lib/supabase/server';
import type { GigInsert } from '@/types/db';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const uid = await userIdFromCookie();
  if (!uid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supa = adminSupabase();
  const { data: profile, error: profErr } = await supa
    .from('profiles')
    .select('can_post_job')
    .eq('id', uid)
    .single();
  if (profErr) return NextResponse.json({ error: profErr.message }, { status: 500 });
  if (!profile || !profile.can_post_job)
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  if (!body.title || !body.description)
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });

  const payload: GigInsert = {
    owner: uid,
    title: body.title,
    description: body.description,
    budget: body.budget ?? null,
    city: body.city ?? null,
    status: 'open',
    published: true,
  };

  const { data, error } = await supa
    .from('gigs')
    .insert(payload)
    .select('id')
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ id: data.id }, { status: 201 });
}

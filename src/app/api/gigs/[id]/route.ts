import { NextResponse } from 'next/server';
import { publicSupabase, userIdFromCookie } from '@/lib/supabase/server';
import type { Gig } from '@/types/db';

export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const supa = publicSupabase();
  const uid = await userIdFromCookie();
  const id = Number(params.id);

  let query = supa
    .from('gigs')
    .select('id, owner, title, description, budget, city, created_at, status, published')
    .eq('id', id)
    .limit(1);

  if (uid) {
    query = query.or(`published.eq.true,owner.eq.${uid}`);
  } else {
    query = query.eq('published', true);
  }

  const { data, error } = await query.single();
  if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(data as Gig);
}

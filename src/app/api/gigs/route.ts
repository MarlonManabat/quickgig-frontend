import { NextResponse } from 'next/server';
import { publicSupabase } from '@/lib/supabase/server';
import type { Gig } from '@/types/db';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search')?.trim();
  const city = searchParams.get('city')?.trim();

  const supa = await publicSupabase();
  if (!supa) return NextResponse.json({ items: [] });

  let query = supa
    .from('gigs')
    .select('id, owner, title, description, budget, city, created_at, status, published')
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (search) {
    const like = `%${search}%`;
    query = query.or(`title.ilike.${like},description.ilike.${like}`);
  }
  if (city) {
    query = query.eq('city', city);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: (data as Gig[]) || [] });
}

import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase/server';
import type { GigsResponse, GigSort } from '@/types/gigs';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q')?.trim() || '';
  const region = searchParams.get('region')?.trim() || '';
  const sort = (searchParams.get('sort') as GigSort) || 'new';
  const page = Math.max(parseInt(searchParams.get('page') || '1', 10), 1);
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  const supa = getSupabaseServer();

  let query = supa
    .from('gigs')
    .select('id,title,company,region,rate,created_at', { count: 'exact' })
    .eq('published', true);

  if (q) {
    const like = `%${q}%`;
    query = query.or(`title.ilike.${like},description.ilike.${like}`);
  }
  if (region) {
    query = query.eq('region', region);
  }
  if (sort === 'pay_high') {
    query = query.order('rate', { ascending: false });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  const from = (page - 1) * limit;
  const to = from + limit - 1;
  const { data, count, error } = await query.range(from, to);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({
    items: data ?? [],
    total: count ?? 0,
    page,
    limit,
  } satisfies GigsResponse);
}

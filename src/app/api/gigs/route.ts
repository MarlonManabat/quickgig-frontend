import { NextResponse } from 'next/server';
import { publicSupabase } from '@/lib/supabase/server';
import type { GigsResponse, GigSort } from '@/types/gigs';
import { gigs as mockGigs } from '@/lib/mock/gigs';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q')?.trim() || '';
  const region = searchParams.get('region')?.trim() || '';
  const sort = (searchParams.get('sort') as GigSort) || 'new';
  const page = Math.max(parseInt(searchParams.get('page') || '1', 10), 1);
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  const supa = await publicSupabase();

  if (!supa) {
    let items = [...mockGigs];
    if (q) {
      const ql = q.toLowerCase();
      items = items.filter((g) =>
        g.title.toLowerCase().includes(ql) || g.description.toLowerCase().includes(ql)
      );
    }
    if (region) {
      items = items.filter((g) => g.region === region);
    }
    if (sort === 'pay_high') {
      items.sort((a, b) => b.rate - a.rate);
    } else {
      items.sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }
    const total = items.length;
    const start = (page - 1) * limit;
    const paged = items.slice(start, start + limit);
    const mapped = paged.map(({ id, title, company, region, rate, created_at }) => ({
      id,
      title,
      company,
      region,
      rate,
      created_at,
    }));
    return NextResponse.json({ items: mapped, total, page, limit } satisfies GigsResponse);
  }

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

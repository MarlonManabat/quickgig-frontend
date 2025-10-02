import { NextResponse } from 'next/server';
import { publicSupabase, adminSupabase } from '@/lib/supabase/server';
import { userIdFromCookie } from '@/lib/supabase/server';
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


export async function POST(req: Request) {
  try {
    const { title, description, budget, region_code, city_code } = await req.json();
    
    if (!title || !description || !region_code || !city_code) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const userId = await userIdFromCookie();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await adminSupabase();
    if (!supabase) {
      return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });
    }

    // Check if user has tickets (though we don't spend them on posting)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('tickets')
      .eq('id', userId)
      .single();

    if (profileError || !profile || profile.tickets < 1) {
      return NextResponse.json({ error: 'You need at least 1 ticket to post a job' }, { status: 400 });
    }

    // Create the gig using the RPC function that checks tickets
    const { data: gigId, error: gigError } = await supabase.rpc('create_gig_if_allowed', {
      p_title: title,
      p_description: description,
      p_region_code: region_code,
      p_city_code: city_code,
      p_budget: budget || null
    });

    if (gigError) {
      console.error('Error creating gig:', gigError);
      if (gigError.message?.includes('NEED_TICKET_TO_PARTICIPATE')) {
        return NextResponse.json({ error: 'You need at least 1 ticket to post a job' }, { status: 400 });
      }
      return NextResponse.json({ error: 'Failed to create job posting' }, { status: 500 });
    }

    // Fetch the created gig to return full details
    const { data: gig, error: fetchError } = await supabase
      .from('gigs')
      .select('*')
      .eq('id', gigId)
      .single();

    if (fetchError) {
      console.error('Error fetching created gig:', fetchError);
      return NextResponse.json({ error: 'Job created but failed to fetch details' }, { status: 500 });
    }

    return NextResponse.json({ gig }, { status: 201 });
  } catch (error) {
    console.error('Error in gigs POST route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const supa = supabaseServer();
  if (!supa) return NextResponse.json({ error: 'service unavailable' }, { status: 503 });

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const title = body.title?.trim();
  const description = body.description?.trim();
  if (!title || !description) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const { data: auth } = await supa.auth.getUser();
  const user = auth.user;
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const payload = {
    title,
    description,
    category: body.category?.trim() || null,
    region: body.region?.trim() || null,
    city: body.city?.trim() || null,
    status: body.status?.trim() || 'published',
    created_by: user.id,
  };

  const { data, error } = await supa
    .from('jobs')
    .insert(payload)
    .select('id')
    .single();
  if (error) {
    const status = /rls/i.test(error.message) ? 403 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
  return NextResponse.json({ id: data.id });
}

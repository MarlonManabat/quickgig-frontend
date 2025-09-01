import { NextResponse } from 'next/server';
import { adminSupabase } from '@/lib/supabase/server';
import { create as mockCreate } from '@/lib/mock/gigs';
import type { Gig, GigInsert } from '@/types/gigs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const title = body.title?.trim();
  const company = body.company?.trim();
  const description = body.description?.trim();
  if (!title || !company || !description) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const owner = body.owner ?? body.user_id;
  if (!owner) {
    return NextResponse.json({ error: 'Sign-in required' }, { status: 401 });
  }

  const payload: GigInsert = {
    title,
    company,
    description,
    location: body.location?.trim() || undefined,
    pay_min: body.payMin !== undefined ? Number(body.payMin) : undefined,
    pay_max: body.payMax !== undefined ? Number(body.payMax) : undefined,
    remote: body.remote === true,
    user_id: owner,
  };

  const supa = await adminSupabase();
  if (supa) {
    const created_at = new Date().toISOString();
    const status = payload.status ?? 'open';
    const { data, error } = await supa
      .from('gigs')
      .insert({ ...payload, status, created_at })
      .select('id')
      .single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    const gig: Gig = { id: String(data.id), ...payload, status, created_at };
    return NextResponse.json({ id: gig.id, gig });
  }

  const gig = mockCreate(payload);
  return NextResponse.json({ id: gig.id, gig });
}

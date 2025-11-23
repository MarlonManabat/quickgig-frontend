import { NextResponse } from 'next/server';
import { adminSupabase } from '@/lib/supabase/server';
import { deductTicketOnCreate } from '@/lib/tickets';
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

  const supa = adminSupabase();
  if (!supa) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  try {
    // 1. Deduct ticket (uses admin client to ensure success)
    const gigId = await deductTicketOnCreate(owner, {
      title,
      description,
      region_code: body.region_code?.trim(),
      city_code: body.city_code?.trim(),
      price_php: body.budget !== undefined ? Number(body.budget) : undefined,
    });

    // 2. Insert gig (uses admin client to ensure success)
    const { data: gigData, error: gigError } = await supa
      .from('gigs')
      .insert({
        ...payload,
        id: gigId,
        owner: owner,
        status: payload.status ?? 'published',
        published: true,
      })
      .select()
      .single();

    if (gigError) {
      // NOTE: In a real app, we would need to refund the ticket here.
      console.error('Gig insertion failed:', gigError);
      return NextResponse.json({ error: 'Failed to insert gig after ticket deduction' }, { status: 500 });
    }

    return NextResponse.json({ id: gigId, gig: gigData });
  } catch (e: any) {
    const msg = e.message || 'Could not create gig';
    const status = /ticket/i.test(msg) ? 402 : 400;
    return NextResponse.json({ error: msg }, { status });
  }
}

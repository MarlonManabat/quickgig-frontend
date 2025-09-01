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

  const supa = await adminSupabase();
  if (supa) {
    try {
      const id = await deductTicketOnCreate(owner, {
        title,
        description,
        region_code: body.region_code?.trim(),
        city_code: body.city_code?.trim(),
        price_php:
          body.budget !== undefined ? Number(body.budget) : undefined,
      });
      const created_at = new Date().toISOString();
      const status = payload.status ?? 'open';
      const gig: Gig = { id, ...payload, status, created_at };
      return NextResponse.json({ id, gig });
    } catch (e: any) {
      const msg = e.message || 'Could not create gig';
      const status = /ticket/i.test(msg) ? 402 : 400;
      return NextResponse.json({ error: msg }, { status });
    }
  }

  const gig = mockCreate(payload);
  return NextResponse.json({ id: gig.id, gig });
}

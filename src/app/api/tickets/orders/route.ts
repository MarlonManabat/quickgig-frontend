import { NextResponse } from 'next/server';
import { z } from 'zod';
import supabaseServer from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

const Body = z.object({ qty: z.number().int().refine((v) => [1, 5, 10].includes(v)) });

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const parsed = Body.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: 'bad_request' }, { status: 400 });
    }

    const supa = supabaseServer();
    if (!supa) {
      return NextResponse.json(
        { ok: false, error: 'server_not_configured' },
        { status: 503 },
      );
    }

    const {
      data: { user },
    } = await supa.auth.getUser();
    if (!user) {
      return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
    }

    const priceMap: Record<number, number> = { 1: 20, 5: 100, 10: 200 };
    const qty = parsed.data.qty;
    const amount_php = priceMap[qty];

    const { data, error } = await supa
      .from('ticket_orders')
      .insert({ user_id: user.id, qty, amount_php })
      .select()
      .single();
    if (error) {
      return NextResponse.json({ ok: false, error: 'insert_failed', detail: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, order: data });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: 'unhandled', detail: err?.message ?? String(err) },
      { status: 500 },
    );
  }
}

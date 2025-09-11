// src/app/api/tickets/grant/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSupabase, getAdminClient } from '@/lib/supabase';
import { isAdmin } from '@/lib/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

const Body = z.object({
  email: z.string().email(),
  amount: z.number().int().positive(),
  note: z.string().max(200).optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const parsed = Body.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: 'bad_request' }, { status: 400 });
    }

    const supa = getServerSupabase();
    const admin = await getAdminClient();
    if (!supa || !admin) {
      return NextResponse.json(
        {
          ok: false,
          error: 'server_not_configured',
          hint: 'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY',
        },
        { status: 503 },
      );
    }

    const { data: { user } } = await supa.auth.getUser();
    if (!user || !isAdmin(user.email)) {
      return NextResponse.json({ ok: false, error: 'forbidden' }, { status: 403 });
    }

    const { email, amount, note } = parsed.data;

    const { data: tgt, error: findErr } = await admin.auth.admin.listUsers({ page: 1, perPage: 1, email });
    if (findErr || !tgt?.users?.[0]) {
      return NextResponse.json({ ok: false, error: 'user_not_found' }, { status: 404 });
    }
    const targetId = tgt.users[0].id;

    const { error: rpcErr } = await admin.rpc('admin_grant_tickets', {
      p_user: targetId,
      p_amount: amount,
      p_note: note ?? null,
    });
    if (rpcErr) {
      return NextResponse.json({ ok: false, error: 'rpc_failed', detail: rpcErr.message }, { status: 500 });
    }

    const { data: balRow } = await admin
      .from('ticket_balance_view')
      .select('balance')
      .eq('user_id', targetId)
      .single();

    return NextResponse.json({ ok: true, email, amount, balance: balRow?.balance ?? null });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: 'unhandled', detail: err?.message ?? String(err) },
      { status: 500 },
    );
  }
}

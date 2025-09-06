import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSupabase } from "@/lib/supabase-server";
import { isAdmin } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const Body = z.object({
  email: z.string().email(),
  amount: z.number().int().positive(),
  note: z.string().max(200).optional(),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => ({}));
  const parse = Body.safeParse(json);
  if (!parse.success) return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });

  const supa = getServerSupabase();
  const {
    data: { user },
  } = await supa.auth.getUser();
  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  const { email, amount, note } = parse.data;

  const { data: tgt, error: findErr } = await supabaseAdmin.auth.admin.listUsers({
    page: 1,
    perPage: 1,
    email,
  });
  if (findErr || !tgt?.users?.[0]) {
    return NextResponse.json({ error: "USER_NOT_FOUND" }, { status: 404 });
  }
  const targetId = tgt.users[0].id;

  const { error: rpcErr } = await supabaseAdmin.rpc("admin_grant_tickets", {
    p_user: targetId,
    p_amount: amount,
    p_note: note ?? null,
  });
  if (rpcErr)
    return NextResponse.json(
      { error: "RPC_FAILED", detail: rpcErr.message },
      { status: 500 },
    );

  const { data: balRow } = await supabaseAdmin
    .from("ticket_balance_view")
    .select("balance")
    .eq("user_id", targetId)
    .single();

  return NextResponse.json({ ok: true, email, amount, balance: balRow?.balance ?? null });
}

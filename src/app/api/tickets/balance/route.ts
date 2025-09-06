import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  if (!url || !anon) return NextResponse.json({ ok: false, balance: 0 });

  const supa = createServerClient(url, anon, { cookies });
  const { data: auth } = await supa.auth.getUser();
  const uid = auth?.user?.id;
  if (!uid) return NextResponse.json({ ok: true, balance: 0 });

  // Prefer rpc if present; else sum fallback (kept small).
  let balance = 0;
  const rpc = await supa.rpc("tickets_balance", { p_user: uid } as any);
  if (!rpc.error && typeof rpc.data === "number") balance = rpc.data;
  else {
    const res = await supa
      .from("ticket_ledger")
      .select("delta")
      .eq("user_id", uid)
      .limit(1000);
    if (!res.error && res.data)
      balance = res.data.reduce((a, r: any) => a + (r.delta || 0), 0);
  }
  return NextResponse.json({ ok: true, balance });
}

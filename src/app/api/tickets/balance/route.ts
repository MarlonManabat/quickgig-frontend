import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { MOCK_MODE } from "@/lib/env";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET() {
  if (MOCK_MODE) return NextResponse.json({ ok: true, balance: 0, source: "mock" });

  const supa = supabaseServer();
  if (!supa) return NextResponse.json({ ok: true, balance: 0, source: "noop" });

  const { data: auth } = await supa.auth.getUser();
  const uid = auth?.user?.id;
  if (!uid) return NextResponse.json({ ok: true, balance: 0, source: "anon" });

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
  return NextResponse.json({ ok: true, balance, source: "db" });
}

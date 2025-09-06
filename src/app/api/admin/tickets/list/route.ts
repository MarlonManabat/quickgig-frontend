import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET(req: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supa = createServerClient(url, anon, { cookies });

  const { data: user } = await supa.auth.getUser();
  const uid = user?.user?.id;
  if (!uid) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });

  // Basic admin gate: profiles.is_admin OR app_metadata.role === 'admin'
  const prof = await supa.from("profiles").select("is_admin").eq("id", uid).maybeSingle();
  const isAdmin = (prof.data?.is_admin === true) || (user?.user?.app_metadata?.role === "admin");
  if (!isAdmin) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });

  const urlObj = new URL(req.url);
  const limit = Math.min(parseInt(urlObj.searchParams.get("limit") || "200", 10), 500);

  const { data: rows = [], error } = await supa
    .from("ticket_ledger")
    .select("id,created_at,user_id,delta,source,ref_id")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true, rows });
}


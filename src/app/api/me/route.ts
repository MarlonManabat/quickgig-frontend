import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supa = createServerClient(url, anon, { cookies });

  const { data: user } = await supa.auth.getUser();
  const uid = user?.user?.id;
  let profile: any = null;

  if (uid) {
    const p = await supa.from("profiles").select("id,is_admin,email,full_name").eq("id", uid).maybeSingle();
    profile = p.data ?? null;
  }
  return NextResponse.json({ user: user?.user ?? null, profile });
}


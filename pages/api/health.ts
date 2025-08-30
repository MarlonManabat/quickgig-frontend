import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/db";
import { env } from "@/lib/env";

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse,
) {
  let supabaseStatus: "ok" | "error" = "ok";
  try {
    const supa = createClient<Database>(
      env.NEXT_PUBLIC_SUPABASE_URL,
      env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    );
    const { error } = await supa.from("profiles").select("id").limit(1);
    if (error) supabaseStatus = "error";
  } catch {
    supabaseStatus = "error";
  }

  const ok = supabaseStatus === "ok";
  res.status(200).json({
    ok,
    time: new Date().toISOString(),
    env: process.env.VERCEL ? "vercel" : "local",
    supabase: supabaseStatus,
  });
}

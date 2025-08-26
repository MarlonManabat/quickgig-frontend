import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse,
) {
  let supabaseStatus: "ok" | "error" = "ok";
  try {
    const supa = createClient(env.supabaseUrl, env.supabaseAnon);
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

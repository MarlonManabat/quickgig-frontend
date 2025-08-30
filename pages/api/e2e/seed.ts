import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (process.env.E2E_KEY && req.query.key !== process.env.E2E_KEY) {
    return res.status(401).json({ error: "unauthorized" });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE;
  if (!url || !serviceRole) {
    return res.status(200).json({ status: "noop" });
  }

  const supabase = createClient<Database>(url, serviceRole, {
    auth: { persistSession: false },
  });

  try {
    await supabase
      .from("profiles")
      .upsert([{ id: "e2e-user" }], { onConflict: "id" });
  } catch {}

  return res.status(200).json({ status: "ok" });
}

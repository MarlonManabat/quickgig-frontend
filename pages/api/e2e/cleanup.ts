import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  // Optional protection (same contract as /seed)
  const requiredKey = process.env.E2E_KEY;
  if (requiredKey && req.headers["x-e2e-key"] !== requiredKey) return res.status(401).end();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string | undefined;
  const role = process.env.SUPABASE_SERVICE_ROLE as string | undefined;
  if (!url || !role) return res.status(204).end();

  const supabase = createClient(url, role, { auth: { persistSession: false } });

  // Clean up artifacts tagged as 'e2e' (tables must exist in our schema)
  try {
    await supabase.from("applications").delete().eq("tag", "e2e");
  } catch {}
  try {
    await supabase.from("gigs").delete().eq("tag", "e2e");
  } catch {}
  try {
    await supabase.from("threads").delete().eq("tag", "e2e");
  } catch {}

  return res.status(200).json({ ok: true });
}

import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import { env, requireServer } from "@/lib/env";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const regionId = String(req.query.regionId ?? "");
  if (!regionId) return res.status(400).json({ error: "regionId required" });
  const key = requireServer('SUPABASE_SERVICE_ROLE_KEY');
  if (!key) return res.status(500).json([]);
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, key);
  const { data, error } = await supabase
    .from("cities")
    .select("id,name")
    .eq("region_id", regionId)
    .order("name");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data ?? []);
}

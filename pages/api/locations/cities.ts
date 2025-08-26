import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const regionId = String(req.query.regionId ?? "");
  if (!regionId) return res.status(400).json({ error: "regionId required" });
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
  const { data, error } = await supabase
    .from("cities")
    .select("id,name")
    .eq("region_id", regionId)
    .order("name");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data ?? []);
}

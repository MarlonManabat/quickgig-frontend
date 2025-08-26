import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import { env, requireServer } from "@/lib/env";

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const adminToken = process.env.ADMIN_TASK_TOKEN;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const serviceRole = requireServer('SUPABASE_SERVICE_ROLE_KEY');
  if (!serviceRole) {
    res.status(500).json({ error: 'missing service role' });
    return;
  }
  const token = req.headers["authorization"]?.split("Bearer ")[1];
  if (!adminToken || token !== adminToken) {
    res.status(401).json({ error: "unauthorized" });
    return;
  }
  const supabase = createClient(url, serviceRole);

  for (const id of ["avatars", "payment-proofs"]) {
    await supabase.storage.createBucket(id, { public: true }).catch(() => {});
  }

  res.json({ ok: true });
}

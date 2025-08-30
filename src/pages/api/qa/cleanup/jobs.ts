import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/db";
import { env, requireServer } from "@/lib/env";

function assertQA(req: NextApiRequest) {
  if (process.env.QA_TEST_MODE !== "true") throw new Error("QA disabled");
  const ok = req.headers["x-qa-secret"] === process.env.QA_TEST_SECRET;
  if (!ok) throw new Error("Unauthorized");
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (process.env.QA_ENABLED !== "true")
    return res.status(404).end("Not Found");
  try {
    assertQA(req);
    const { titlePrefix } = req.body || {};
    if (!titlePrefix)
      return res.status(400).json({ error: "titlePrefix required" });
    const key = requireServer('SUPABASE_SERVICE_ROLE');
    if (!key) return res.status(500).end();
    const supa = createClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, key);
    await supa.from("gigs").delete().ilike("title", `${titlePrefix}%`);
    res.status(200).json({ ok: true });
  } catch (e: any) {
    res.status(401).json({ ok: false, error: e?.message || "error" });
  }
}

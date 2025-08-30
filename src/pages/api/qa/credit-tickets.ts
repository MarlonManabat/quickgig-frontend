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
    const { userId, tickets = 5 } = req.body || {};
    if (!userId) return res.status(400).json({ error: "userId required" });
    const key = requireServer('SUPABASE_SERVICE_ROLE');
    if (!key) return res.status(500).end();
    const supa = createClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, key);
    const { error } = await supa.rpc("credit_tickets_admin", {
      p_user: userId,
      p_tickets: tickets,
      p_reason: "qa_credit",
      p_ref: null,
    });
    if (error) return res.status(400).json({ ok: false, error: error.message });
    res.status(200).json({ ok: true });
  } catch (e: any) {
    res.status(401).json({ ok: false, error: e?.message || "error" });
  }
}

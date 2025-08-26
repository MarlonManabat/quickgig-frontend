import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

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
    const supa = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );
    await supa.from("gigs").delete().ilike("title", `${titlePrefix}%`);
    res.status(200).json({ ok: true });
  } catch (e: any) {
    res.status(401).json({ ok: false, error: e?.message || "error" });
  }
}

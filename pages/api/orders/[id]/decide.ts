import type { NextApiRequest, NextApiResponse } from "next";
import { createServerClient } from "@/utils/supabaseClient";
import { isAdmin } from "@/lib/auth";
import { asString } from "@/lib/normalize";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "method not allowed" });
    return;
  }
  const supabase = createServerClient();
  await supabase.rpc("set_config", {
    setting_name: "app.admin_emails",
    new_value: process.env.ADMIN_EMAILS ?? "",
    is_local: true,
  });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) {
    res.status(403).json({ error: "forbidden" });
    return;
  }

  const { decision } = req.body || {};
  if (decision !== "paid" && decision !== "rejected") {
    res.status(400).json({ error: "bad decision" });
    return;
  }

  const id = asString(req.query.id);
  if (!id) return res.status(400).json({ error: "id required" });
  const { error } = await supabase
    .from("orders")
    .update({ status: decision })
    .eq("id", id);
  if (error) {
    res.status(400).json({ error: error.message });
    return;
  }
  res.json({ ok: true });
}

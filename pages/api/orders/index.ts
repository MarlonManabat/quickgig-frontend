import type { NextApiRequest, NextApiResponse } from "next";
import { createServerClient } from "@/utils/supabaseClient";
import { TICKET_PRICE_PHP, makeRef } from "@/lib/payments";
import { isAdmin } from "@/lib/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const supabase = createServerClient();
  await supabase.rpc("set_config", {
    setting_name: "app.admin_emails",
    new_value: process.env.ADMIN_EMAILS ?? "",
    is_local: true,
  });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    res.status(401).json({ error: "unauthorized" });
    return;
  }

  if (req.method === "POST") {
    const { data, error } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        amount: TICKET_PRICE_PHP,
        reference: makeRef(),
        status: "pending",
      })
      .select("id, reference")
      .single();
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.json({ id: data.id, reference: data.reference });
    return;
  }

  if (req.method === "GET") {
    let query = supabase
      .from("orders")
      .select(
        "id, user_id, amount, reference, proof_url, status, created_at, user:auth.users(email)",
      )
      .order("created_at", { ascending: false });
    if (!isAdmin(user.email)) query = query.eq("user_id", user.id);
    const { data, error } = await query;
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.json({ orders: data });
    return;
  }

  res.status(405).json({ error: "method not allowed" });
}

import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabaseClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const matchId = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;

    const { data, error } = await supabase.rpc("rpc_refund_match_tickets", {
      p_match: matchId,
    });

    if (error) {
      console.error("Refund RPC failed:", error);
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ ok: true, data });
  } catch (err: any) {
    console.error("Unexpected error in cancel API:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

import type { NextApiRequest, NextApiResponse } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { sendNotification } from "@/lib/notifications";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.status(405).end();
    return;
  }
  const supabase = createServerSupabaseClient({ req, res });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    res.status(401).end();
    return;
  }
  const allowed = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  if (!allowed.includes((user.email || "").toLowerCase())) {
    res.status(404).end("Not Found");
    return;
  }
  const { id, status, reason } = req.body || {};
  if (!["approved", "flagged"].includes(status)) {
    res.status(400).json({ error: "invalid status" });
    return;
  }

  const { data: proof } = await supabase
    .from("payment_proofs")
    .select("user_id")
    .eq("id", id)
    .single();

  const { error } = await supabase.rpc("admin_set_payment_status", {
    proof_id: id,
    new_status: status,
  });
  if (error) {
    res.status(400).json({ error: error.message });
    return;
  }

  const employerId = (proof as any)?.user_id;
  const qty = Number(process.env.NEXT_PUBLIC_TICKETS_PER_PROOF || "0");
  if (employerId) {
    if (status === "approved") {
      await sendNotification({
        type: "payment_approved",
        actorUserId: user.id,
        targetUserId: employerId,
        ticketsAdded: qty,
      });
    }
    if (status === "flagged") {
      await sendNotification({
        type: "payment_rejected",
        actorUserId: user.id,
        targetUserId: employerId,
        reason,
      });
    }
  }

  res.status(200).json({ ok: true });
  return;
}

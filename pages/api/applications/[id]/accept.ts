import type { NextApiRequest, NextApiResponse } from "next";
import { createServerClient } from "@/utils/supabaseClient";
import { emitNotification } from "@/lib/notifications";
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
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    res.status(401).json({ error: "unauthorized" });
    return;
  }
  const appId = req.query.id as string;
  const { data: app } = await supabase
    .from("applications")
    .select("gig_id")
    .eq("id", appId)
    .single();
  const { data: gig } = await supabase
    .from("gigs")
    .select("title, owner_id")
    .eq("id", (app as any)?.gig_id)
    .single();

  const { error } = await supabase.rpc("app_accept", { p_app_id: appId });
  if (error) {
    res.status(400).json({ error: error.message });
    return;
  }

  const ownerId = asString((gig as any)?.owner_id);
  const title = asString((gig as any)?.title);
  if (ownerId && title) {
    await emitNotification({
      userId: ownerId,
      type: "offer_accepted",
      title: "Your offer was accepted",
      body: `Your offer for “${title}” was accepted. You’re now hired!`,
      link: `${process.env.NEXT_PUBLIC_APP_URL}/gigs/${(app as any)?.gig_id}`,
      uniq: `offer_accepted:${appId}`,
    });
  }

  res.json({ ok: true });
}

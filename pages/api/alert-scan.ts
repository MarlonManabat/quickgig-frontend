import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse,
) {
  const { data: alerts } = await supabase.from("gig_alerts").select("*");
  const now = new Date().toISOString();
  for (const a of alerts ?? []) {
    const since =
      a.last_notified_at ??
      new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
    let q = supabase
      .from("gigs")
      .select("id,title,city")
      .gt("created_at", since)
      .or(`title.ilike.%${a.keyword}%,description.ilike.%${a.keyword}%`)
      .neq("hidden", true);
    if (a.city) q = q.eq("city", a.city);
    const { data: gigs } = await q;
    if (gigs && gigs.length) {
      await supabase.from("notifications").insert(
        gigs.map((g: any) => ({
          user_id: a.user_id,
          kind: "alert_match",
          payload: { gig_id: g.id, title: g.title },
        })),
      );
      if (process.env.RESEND_API_KEY && process.env.NOTIFY_FROM) {
        const {
          data: { user },
        } = await supabase.auth.admin.getUserById(a.user_id);
        if (user?.email) {
          const body = gigs
            .map((g: any) => `<div>${g.title} - ${g.city ?? ""}</div>`)
            .join("");
          await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: process.env.NOTIFY_FROM,
              to: [user.email],
              subject: "New gigs match your alert",
              html: `<div>${body}</div>`,
            }),
          }).catch(() => {});
        }
      }
      await supabase
        .from("gig_alerts")
        .update({ last_notified_at: now })
        .eq("id", a.id);
    }
  }
  res.status(200).json({ ok: true });
}

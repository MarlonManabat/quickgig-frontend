import type { NextApiRequest, NextApiResponse } from "next";
import getRawBody from "raw-body";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";

export const config = { api: { bodyParser: false } };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const buf = await getRawBody(req);
  const sig = req.headers["stripe-signature"] as string;
  let evt;
  try {
    evt = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (e: any) {
    return res.status(400).send(`Webhook Error: ${e.message}`);
  }

  if (evt.type === "account.updated") {
    const acct = evt.data.object as any;
    const payoutReady = !!(acct.details_submitted && acct.payouts_enabled);
    const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
    const { data: prof } = await admin.from("profiles").select("id").eq("stripe_account_id", acct.id).single();
    if (prof?.id) {
      await admin.from("profiles").update({ stripe_payout_ready: payoutReady }).eq("id", prof.id);
      if (payoutReady) {
        await admin.from("notifications").insert({ user_id: prof.id, kind: "payout_ready", payload: { accountId: acct.id } });
      }
    }
  }
  res.json({ received: true });
}

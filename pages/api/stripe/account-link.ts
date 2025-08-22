import type { NextApiRequest, NextApiResponse } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { stripe } from "@/lib/stripe";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabaseClient({ req, res });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return res.status(401).json({ error: "unauthenticated" });

  const { data: profile } = await supabase.from("profiles").select("stripe_account_id").eq("id", user.id).single();
  if (!profile?.stripe_account_id) return res.status(400).json({ error: "no stripe account" });

  const link = await stripe.accountLinks.create({
    account: profile.stripe_account_id,
    type: "account_onboarding",
    refresh_url: `${process.env.NEXT_PUBLIC_SITE_URL}/settings/payouts?refresh=1`,
    return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/settings/payouts?done=1`,
  });
  res.json({ url: link.url });
}

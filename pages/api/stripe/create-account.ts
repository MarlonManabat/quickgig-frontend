import type { NextApiRequest, NextApiResponse } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { createOrGetAccount } from "@/lib/payments";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabaseClient({ req, res });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return res.status(401).json({ error: "unauthenticated" });

  const { data: profile } = await supabase.from("profiles").select("id, email, stripe_account_id").eq("id", user.id).single();
  const accountId = await createOrGetAccount({ email: profile?.email, userId: user.id, existing: profile?.stripe_account_id || null });
  if (accountId !== profile?.stripe_account_id) {
    await supabase.from("profiles").update({ stripe_account_id: accountId }).eq("id", user.id);
  }
  res.json({ accountId });
}

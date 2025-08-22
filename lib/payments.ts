import { stripe } from "./stripe";

export async function createOrGetAccount({ email, userId, existing }: { email?: string | null, userId: string, existing?: string | null }) {
  if (existing) return existing;
  const acct = await stripe.accounts.create({ type: "express", email: email || undefined, metadata: { user_id: userId } });
  return acct.id;
}

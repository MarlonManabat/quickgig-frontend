import { sendTemplate } from "@/lib/email";
import { supabase } from "@/lib/supabaseClient";
import { asString } from "@/lib/normalize";

async function getUserEmail(userId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("email")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.warn("getUserEmail error:", error);
    return null;
  }
  return asString(data?.email);
}

export async function notifyPaymentApproved(paymentId: string) {
  const { data: p, error } = await supabase
    .from("payments")
    .select("id, user_id, expected_tickets")
    .eq("id", paymentId)
    .maybeSingle();

  if (error || !p) {
    console.warn("notifyPaymentApproved: payment not found", {
      paymentId,
      error,
    });
    return;
  }

  const to = await getUserEmail(asString((p as any).user_id) ?? "");
  if (!to) {
    console.warn("notifyPaymentApproved: email not found for user", p.user_id);
    return;
  }

  await sendTemplate(to, "payment-approved", { tickets: p.expected_tickets });
}

export async function notifyPaymentRejected(paymentId: string, reason: string) {
  const { data: p, error } = await supabase
    .from("payments")
    .select("id, user_id")
    .eq("id", paymentId)
    .maybeSingle();

  if (error || !p) {
    console.warn("notifyPaymentRejected: payment not found", {
      paymentId,
      error,
    });
    return;
  }

  const to = await getUserEmail(asString((p as any).user_id) ?? "");
  if (!to) {
    console.warn("notifyPaymentRejected: email not found for user", p.user_id);
    return;
  }

  await sendTemplate(to, "payment-rejected", { reason });
}

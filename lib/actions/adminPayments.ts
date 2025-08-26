import { supabase } from "@/lib/supabaseClient";

export async function approvePayment(paymentId: string, note?: string) {
  const { error } = await supabase.rpc("rpc_admin_approve_payment", {
    p_payment: paymentId,
    p_note: note ?? null,
  });
  if (error) throw error;
}

export async function rejectPayment(paymentId: string, reason: string) {
  const { error } = await supabase.rpc("rpc_admin_reject_payment", {
    p_payment: paymentId,
    p_reason: reason,
  });
  if (error) throw error;
}

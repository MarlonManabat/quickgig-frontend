import { supabase } from "./supabaseClient";
import type { Insert } from "@/types/db";
import { asNumber } from "./normalize";

export async function getBalance(userId: string): Promise<number> {
  const { data, error } = await supabase
    .from("tickets_balances")
    .select("balance")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return asNumber(data?.balance) ?? 0;
}

export async function addEntry(userId: string, delta: number, reason: string) {
  const { error } = await supabase
    .from("tickets_ledger")
    .insert([
      { user_id: userId, delta, reason } satisfies Insert<"tickets_ledger">,
    ]);
  if (error) throw error;
}

export async function requireTicket(userId: string, reason: string) {
  const balance = await getBalance(userId);
  if (balance <= 0) throw new Error("Insufficient tickets");
  await addEntry(userId, -1, reason);
}

export async function getMyTicketBalance() {
  const { data } = await supabase.auth.getUser();
  const id = data.user?.id;
  if (!id) return 0;
  return getBalance(id);
}

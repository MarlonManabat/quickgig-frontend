import { supabase } from "@/utils/supabaseClient";
import type { Insert } from "@/types/db";

export async function listAlerts() {
  return supabase
    .from("gig_alerts")
    .select("*")
    .order("created_at", { ascending: false });
}
export async function createAlert(keyword: string, city?: string) {
  return supabase
    .from("gig_alerts")
    .insert([
      { keyword, city } satisfies Insert<"gig_alerts">,
    ]);
}
export async function deleteAlert(id: number) {
  return supabase.from("gig_alerts").delete().eq("id", id);
}

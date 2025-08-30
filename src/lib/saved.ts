import { supabase } from "@/utils/supabaseClient";
import type { Insert } from "@/types/db";

export async function isSaved(gigId: number) {
  const { data } = await supabase
    .from("saved_gigs")
    .select("gig_id")
    .eq("gig_id", gigId)
    .maybeSingle();
  return !!data;
}

export async function toggleSave(gigId: number) {
  if (await isSaved(gigId)) {
    await supabase.from("saved_gigs").delete().eq("gig_id", gigId);
    return false;
  } else {
    await supabase
      .from("saved_gigs")
      .insert([
        { gig_id: gigId } satisfies Insert<"saved_gigs">,
      ]);
    return true;
  }
}

export async function mySaved(limit = 20, from = 0) {
  return supabase
    .from("saved_gigs")
    .select("gig_id, created_at, gigs ( title, city, budget )")
    .neq("gigs.hidden", true)
    .order("created_at", { ascending: false })
    .range(from, from + limit - 1);
}

import { getBrowserSupabase } from "@/lib/supabase/client";
import type { Gig } from "@/lib/db/types";
import type { Insert, Update } from "@/types/db";

export function listGigs() {
  const supabase = getBrowserSupabase();
  if (!supabase) return null;
  return supabase
    .from("gigs")
    .select("*")
    .order("created_at", { ascending: false });
}

export function getGig(id: number) {
  const supabase = getBrowserSupabase();
  if (!supabase) return null;
  return supabase.from("gigs").select("*").eq("id", id).single();
}

export function createGig(gig: Partial<Gig>) {
  const supabase = getBrowserSupabase();
  if (!supabase) return null;
  return supabase
    .from("gigs")
    .insert([{ ...(gig as any) } satisfies Insert<"gigs">])
    .select()
    .single();
}

export function updateGig(id: number, gig: Partial<Gig>) {
  const supabase = getBrowserSupabase();
  if (!supabase) return null;
  return supabase
    .from("gigs")
    .update((gig as Update<"gigs">))
    .eq("id", id)
    .select()
    .single();
}

export async function toggleSave(id: number, saved: boolean) {
  const supabase = getBrowserSupabase();
  if (!supabase) throw new Error("Missing Supabase client");
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("not logged in");
  if (saved) {
    return supabase
      .from("saved_gigs")
      .delete()
      .eq("gig_id", id)
      .eq("user_id", user.id);
  }
  return supabase
    .from("saved_gigs")
    .insert([
      { gig_id: id, user_id: user.id } satisfies Insert<"saved_gigs">,
    ]);
}

export async function applyToGig(id: number, message: string) {
  const supabase = getBrowserSupabase();
  if (!supabase) throw new Error("Missing Supabase client");
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("not logged in");
  return supabase
    .from("applications")
    .insert([
      { gig_id: id, applicant_id: user.id, message } satisfies Insert<"applications">,
    ]);
}

export async function listMyApplications() {
  const supabase = getBrowserSupabase();
  if (!supabase) throw new Error("Missing Supabase client");
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("not logged in");
  return supabase
    .from("applications")
    .select("*, gigs(*)")
    .eq("applicant_id", user.id);
}

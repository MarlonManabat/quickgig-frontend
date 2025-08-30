import { supabase } from "./supabaseClient";
import { Insert } from "@/types/db";

export async function getMyProfile() {
  const { data, error } = await supabase.from("profiles").select("*").single();
  if (error && error.code !== "PGRST116") throw error;
  return data ?? null;
}

export async function upsertMyProfile(payload: {
  full_name?: string;
  avatar_url?: string;
}) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { data, error } = await supabase
    .from("profiles")
    .upsert([{ id: user.id, ...payload } satisfies Insert<"profiles">], {
      onConflict: "id",
    })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

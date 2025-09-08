import type { User } from "@supabase/supabase-js";
import { getServerSupabase as getSupabaseServer } from "@/lib/supabase/server";

export async function getUserSafe(): Promise<User | null> {
  const supabase = getSupabaseServer?.();
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) return null;
    return data?.user ?? null;
  } catch {
    return null;
  }
}

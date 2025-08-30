import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/db";

let _supabase: ReturnType<typeof createClient<Database>> | undefined;

/**
 * Lazy client creator. Never throws at import time.
 * In CI without envs we return a no-op placeholder to avoid crashing the build.
 * Real routes/components will still error if they rely on DB at runtime without envs.
 */
export function getSupabase(): ReturnType<typeof createClient<Database>> {
  if (_supabase) return _supabase;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  if (!url || !key) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[supabase] env missing in CI/build — returning no-op client");
    }
    // minimal no-op shape to avoid undefined access in harmless code paths
    _supabase = {} as any;
  } else {
    _supabase = createClient<Database>(url, key);
  }
  return _supabase!;
}

export const supabase = getSupabase();

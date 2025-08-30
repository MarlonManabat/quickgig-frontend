import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/db";

export function getBrowserSupabase() {
  if (typeof window === "undefined") return null;
  const w = window as any;
  if (w.__sb) return w.__sb as ReturnType<typeof createClient<Database>>;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
  if (!url || !key) return null;
  w.__sb = createClient<Database>(url, key);
  return w.__sb;
}

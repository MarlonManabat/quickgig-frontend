import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/types/db";

export function getServerClient(ctx: any) {
  return createServerSupabaseClient<Database>(ctx);
}

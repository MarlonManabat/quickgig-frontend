import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "../db/types";

export function getServerClient(ctx: any) {
  return createServerSupabaseClient<Database>(ctx);
}

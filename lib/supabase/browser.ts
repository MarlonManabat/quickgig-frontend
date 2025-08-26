import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "../db/types";

let client: ReturnType<typeof createBrowserSupabaseClient<Database>>;

export function getBrowserClient() {
  if (!client) client = createBrowserSupabaseClient<Database>();
  return client;
}

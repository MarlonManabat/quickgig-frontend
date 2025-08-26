import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Singleton
export const supabase = createClient(url, anon);

export function createServerClient() {
  return createClient(url, anon, { auth: { persistSession: false } });
}

"use client";

import { createBrowserClient } from "@supabase/ssr";

/** Browser/client-side Supabase */
export function getBrowserSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createBrowserClient(url, anon);
}

// Back-compat exports
export const supabaseBrowser = getBrowserSupabase;
export default getBrowserSupabase;

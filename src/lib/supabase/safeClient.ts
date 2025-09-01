import { createClient } from '@supabase/supabase-js';

// Works in both server & client, but doesn’t crash at build
export function getSupabaseSafe() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // During CI/Vercel build or smoke we may not inject envs:
  if (!url || !key) return null;

  // Lazily construct to avoid touching env at import time
  return createClient(url, key, {
    auth: { persistSession: false },
  });
}

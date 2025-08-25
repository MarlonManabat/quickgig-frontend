import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let _client: SupabaseClient | null = null;

export function getSupabaseBrowser(): SupabaseClient | null {
  if (typeof window === 'undefined') return null; // avoid SSR/build
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    console.warn('[supabase] Missing NEXT_PUBLIC_SUPABASE_URL/ANON_KEY');
    return null;
  }
  if (!_client) _client = createClient(url, anon, { auth: { persistSession: true } });
  return _client;
}

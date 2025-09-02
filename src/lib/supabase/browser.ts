// src/lib/supabase/browser.ts
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// If you centralize env elsewhere, adjust imports accordingly.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

let _client: SupabaseClient | null = null

export function supabaseBrowser(): SupabaseClient {
  if (!_client) {
    _client = createClient(url, anon, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  }
  return _client
}

// Back-compat default so older imports work:
export default supabaseBrowser


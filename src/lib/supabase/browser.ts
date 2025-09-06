// src/lib/supabase/browser.ts
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { MOCK_MODE, hasSupabaseEnv } from '@/lib/env'

let _client: SupabaseClient | null = null

export function supabaseBrowser(): SupabaseClient {
  if (_client) return _client
  if (!hasSupabaseEnv() || MOCK_MODE) return null as unknown as SupabaseClient
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  _client = createClient(url, anon, {
    auth: { persistSession: true, autoRefreshToken: true },
  })
  return _client
}

// Back-compat default so older imports work:
export default supabaseBrowser


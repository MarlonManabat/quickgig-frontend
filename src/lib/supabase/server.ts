import 'server-only';
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const service = process.env.SUPABASE_SERVICE_ROLE!;

function assertEnv() {
  if (!url) throw new Error('Supabase URL is missing');
  if (!anon) throw new Error('Supabase anon key is missing');
  if (!service) throw new Error('Supabase service role key is missing');
}

/** Public client for browser-safe anon operations (still created on server). */
export function publicSupabase() {
  assertEnv();
  return createClient(url, anon, { auth: { autoRefreshToken: false, persistSession: false } });
}

/** Admin client for secure server-side tasks. NEVER expose `service` to client. */
export function adminSupabase() {
  assertEnv();
  return createClient(url, service, { auth: { autoRefreshToken: false, persistSession: false } });
}

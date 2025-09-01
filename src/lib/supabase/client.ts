// client-only Supabase auth (safe with anon key)
import { createClient } from '@supabase/supabase-js';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Only construct in the browser to avoid build-time crashes
export function getBrowserSupabase() {
  if (typeof window === 'undefined') return null; // SSR/build path: never create
  if (!URL || !ANON) {
    // Return null so callers can show a friendly error instead of crashing build
    return null;
  }
  return createClient(URL, ANON, {
    auth: { persistSession: true, flowType: 'pkce' }
  });
}

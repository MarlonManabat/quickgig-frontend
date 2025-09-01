// client-only Supabase auth (safe with anon key)
import { createClient } from '@supabase/supabase-js';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Only construct in the browser to avoid build-time crashes
export function getBrowserSupabase() {
  if (typeof window === 'undefined') return null;
  if (!URL || !KEY) return null;
  return createClient(URL, KEY, {
    auth: { persistSession: true, flowType: 'pkce' }
  });
}

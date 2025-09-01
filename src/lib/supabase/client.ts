// client-only Supabase auth (safe with anon key)
import { createClient } from '@supabase/supabase-js';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(URL, ANON, {
  auth: { persistSession: true, flowType: 'pkce' }
});

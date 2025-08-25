import type { SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseBrowser } from './browser';

export function expectSupabaseBrowser(): SupabaseClient {
  const c = getSupabaseBrowser();
  if (!c) throw new Error('Supabase client unavailable (SSR/missing env).');
  return c;
}

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseBrowser } from '@/lib/supabase/browser';

export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const c = getSupabaseBrowser();
    if (!c) throw new Error('Supabase client unavailable (SSR/missing env).');
    const value = (c as any)[prop];
    return typeof value === 'function' ? value.bind(c) : value;
  },
}) as SupabaseClient;

export function createServerClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  return createClient(url, anon, { auth: { persistSession: false } });
}

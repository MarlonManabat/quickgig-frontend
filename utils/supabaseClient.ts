import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Singleton
export const supabase: SupabaseClient<Database> = createClient<Database>(url, anon);

export function createServerClient(): SupabaseClient<Database> {
  return createClient<Database>(url, anon, { auth: { persistSession: false } });
}

import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/db';

export function createClient() {
  return createBrowserSupabaseClient<Database>();
}

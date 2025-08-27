import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/lib/db/types';

export function createClient() {
  return createBrowserSupabaseClient<Database>();
}

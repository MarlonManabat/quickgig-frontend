import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/db';
import { getServerSupabase } from './server';
import { getAdminClient as adminClient } from './admin';

export function createClient() {
  return createBrowserSupabaseClient<Database>();
}

export function getClient() {
  return getServerSupabase();
}

export function getAdminClient() {
  return adminClient();
}

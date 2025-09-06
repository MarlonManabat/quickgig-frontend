// src/lib/supabase/admin.ts
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

type AdminClient = SupabaseClient<any, 'public', any>;

/** Returns a service-role client or null when env is missing (never throws at import time). */
export function getAdminClient(): AdminClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;

  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { 'X-Client': 'quickgig-admin' } },
  });
}

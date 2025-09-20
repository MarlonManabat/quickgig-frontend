import 'server-only';

import { createClient } from '@supabase/supabase-js';

type ServiceClient = ReturnType<typeof createClient> | null;

let cached: ServiceClient;

export function getServiceRoleClient(): ServiceClient {
  if (cached) {
    return cached;
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    cached = null;
    return cached;
  }
  cached = createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
  return cached;
}

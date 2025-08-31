import { createClient } from '@supabase/supabase-js';

export function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

// Accept SUPABASE_SERVICE_ROLE or SUPABASE_SERVICE_ROLE_KEY
export function getServiceRoleKey(): string {
  return process.env.SUPABASE_SERVICE_ROLE ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';
}

export function supabaseAdmin(serviceRole: string) {
  const url = requireEnv('NEXT_PUBLIC_SUPABASE_URL');
  const key = serviceRole || getServiceRoleKey();
  if (!key) throw new Error('Missing Supabase service role key');
  return createClient(url, key);
}


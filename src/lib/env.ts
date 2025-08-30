export const isCI = process.env.CI === 'true';

export const env = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
};

export function requireServer(key: keyof typeof env) {
  const val = env[key];
  if (!val && isCI && key === 'SUPABASE_SERVICE_ROLE_KEY') return undefined;
  if (!val) throw new Error(`Missing env: ${key}`);
  return val;
}

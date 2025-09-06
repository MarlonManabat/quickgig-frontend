// No side effects; import when needed.
function read(key: string, fallback?: string) {
  const v = process.env[key] ?? fallback;
  return v;
}

export const ENV = {
  NODE_ENV: read('NODE_ENV', 'development')!,
  APP_ORIGIN: read('NEXT_PUBLIC_APP_ORIGIN', 'http://localhost:3000')!,
  SUPABASE_URL: read('NEXT_PUBLIC_SUPABASE_URL', ''),
  SUPABASE_ANON: read('NEXT_PUBLIC_SUPABASE_ANON_KEY', ''),
  // server-only (not used yet here)
  // SUPABASE_SERVICE_ROLE: read('SUPABASE_SERVICE_ROLE', ''),
};

export const IS_PROD = ENV.NODE_ENV === 'production';

export function hasSupabaseEnv() {
  return Boolean(ENV.SUPABASE_URL && ENV.SUPABASE_ANON);
}
export const MOCK_MODE =
  process.env.MOCK_MODE === '1' ||
  process.env.CI === 'true' ||
  !hasSupabaseEnv();

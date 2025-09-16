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

/**
 * Reads the public API base URL.
 * - In production, throws when the env var is missing.
 * - In non-prod, returns `null` when unset so callers can fall back to mocks.
 */
export function getApiBase(): string | null {
  const raw = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (!raw) {
    if (IS_PROD) throw new Error('NEXT_PUBLIC_API_BASE_URL is required in production');
    return null;
  }
  return raw.replace(/\/+$/, '');
}

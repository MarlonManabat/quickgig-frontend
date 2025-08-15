// Centralized environment variable handling
function getEnv(key: string, fallback = ''): string {
  const value = process.env[key];
  if (!value && process.env.NODE_ENV === 'development') {
    const msg = fallback
      ? `Missing environment variable ${key}, using fallback '${fallback}'.`
      : `Missing environment variable ${key}.`;
    console.warn(msg);
  }
  return value || fallback;
}

export const env = {
  NEXT_PUBLIC_API_BASE: getEnv('NEXT_PUBLIC_API_BASE', 'http://localhost:3001'),
  NEXT_PUBLIC_FACEBOOK_APP_ID: getEnv('NEXT_PUBLIC_FACEBOOK_APP_ID'),
  NEXT_PUBLIC_FACEBOOK_PAGE_ID: getEnv('NEXT_PUBLIC_FACEBOOK_PAGE_ID'),
  NEXT_PUBLIC_ENV: getEnv('NEXT_PUBLIC_ENV', 'local'),
} as const;

export type Env = typeof env;

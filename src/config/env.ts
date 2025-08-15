// Environment variable handling
function getEnv(key: string, fallback?: string) {
  const value = process.env[key];
  if (!value && process.env.NODE_ENV === 'development') {
    console.warn(`Missing environment variable ${key}${fallback ? ", using fallback '" + fallback + "'" : ''}`);
  }
  return value ?? fallback ?? '';
}

export const env = {
  NEXT_PUBLIC_API_URL: getEnv('NEXT_PUBLIC_API_URL', 'http://localhost:3001'),
  API_URL: getEnv('API_URL', getEnv('NEXT_PUBLIC_API_URL', 'http://localhost:3001')),
  JWT_COOKIE_NAME: getEnv('JWT_COOKIE_NAME', 'auth_token'),
  NEXT_PUBLIC_FACEBOOK_APP_ID: getEnv('NEXT_PUBLIC_FACEBOOK_APP_ID'),
  NEXT_PUBLIC_FACEBOOK_PAGE_ID: getEnv('NEXT_PUBLIC_FACEBOOK_PAGE_ID'),
  NEXT_PUBLIC_ENV: getEnv('NEXT_PUBLIC_ENV', 'local'),
  NEXT_PUBLIC_ENABLE_APPLY:
    getEnv('NEXT_PUBLIC_ENABLE_APPLY', 'false').toLowerCase() === 'true',
};

export type Env = typeof env;

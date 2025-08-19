import 'server-only';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const RUNTIME = process.env.NEXT_RUNTIME ?? 'nodejs';
const isBuild =
  process.env.NODE_ENV === 'production' &&
  process.env.VERCEL === '1' &&
  !process.env.VERCEL_URL;

type Env = {
  API_URL?: string;
  JWT_COOKIE_NAME: string;
  JWT_MAX_AGE_SECONDS: number;
};

const raw: Env = {
  API_URL: process.env.API_URL, // required at runtime (not at build)
  JWT_COOKIE_NAME: process.env.JWT_COOKIE_NAME || 'auth_token',
  JWT_MAX_AGE_SECONDS: Number(process.env.JWT_MAX_AGE_SECONDS || 1209600),
};

export function getEnv() {
  // Do not crash at build; enforce at runtime when handlers are executed.
  if (!isBuild && !raw.API_URL) {
    throw new Error('Missing required env: API_URL');
  }
  return raw as Required<Omit<Env, 'API_URL'>> & { API_URL: string };
}

// Backwards-compatible env object with lazy getters
export const env = {
  ...process.env,
  get API_URL() {
    return getEnv().API_URL;
  },
  get apiUrl() {
    return getEnv().API_URL;
  },
  JWT_COOKIE_NAME: raw.JWT_COOKIE_NAME,
  JWT_MAX_AGE_SECONDS: raw.JWT_MAX_AGE_SECONDS,
  cookieName: raw.JWT_COOKIE_NAME,
  maxAge: raw.JWT_MAX_AGE_SECONDS,
  publicApiUrl: process.env.NEXT_PUBLIC_API_URL || '',
  socketUrl: process.env.NEXT_PUBLIC_SOCKET_URL || '',
} as Record<string, any>;

export const isProd =
  (process.env.VERCEL_ENV ?? process.env.NODE_ENV) === 'production';

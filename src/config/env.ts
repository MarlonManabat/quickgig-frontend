import { z } from 'zod';

export const isProd =
  (process.env.VERCEL_ENV ?? process.env.NODE_ENV) === 'production';

const schema = z.object({
  API_URL: z.string(),
  JWT_COOKIE_NAME: z.string(),
  JWT_MAX_AGE_SECONDS: z.coerce.number().default(1209600),
  NEXT_PUBLIC_API_URL: z.string(),
  NEXT_PUBLIC_SOCKET_URL: z.string(),
});

const parsed = schema.parse({
  API_URL:
    process.env.API_URL ?? (isProd ? undefined : 'http://127.0.0.1:8080'),
  JWT_COOKIE_NAME: process.env.JWT_COOKIE_NAME ?? 'auth_token',
  JWT_MAX_AGE_SECONDS: process.env.JWT_MAX_AGE_SECONDS ?? 1209600,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? '',
  NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL ?? '',
});

export const env = {
  ...parsed,
  apiUrl: parsed.API_URL,
  publicApiUrl: parsed.NEXT_PUBLIC_API_URL ?? '',
  socketUrl: parsed.NEXT_PUBLIC_SOCKET_URL ?? '',
  cookieName: parsed.JWT_COOKIE_NAME,
  maxAge: parsed.JWT_MAX_AGE_SECONDS,
};


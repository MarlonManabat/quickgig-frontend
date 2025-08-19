import { z } from 'zod';

export const env: {
  NEXT_PUBLIC_API_URL: string;
  NEXT_PUBLIC_SOCKET_URL: string;
  API_URL: string;
  JWT_COOKIE_NAME: string;
  JWT_MAX_AGE_SECONDS: number;
  NODE_ENV: string;
  VERCEL_ENV: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
} = {
  NEXT_PUBLIC_API_URL: z
    .string()
    .url()
    .parse(process.env.NEXT_PUBLIC_API_URL ?? 'https://api.quickgig.ph'),
  NEXT_PUBLIC_SOCKET_URL: z
    .string()
    .url()
    .parse(process.env.NEXT_PUBLIC_SOCKET_URL ?? 'wss://api.quickgig.ph'),
  API_URL: z.string().url().parse(process.env.API_URL ?? 'https://api.quickgig.ph'),
  JWT_COOKIE_NAME: z.string().min(1).parse(process.env.JWT_COOKIE_NAME ?? 'auth_token'),
  JWT_MAX_AGE_SECONDS: z.coerce.number().default(60 * 60 * 24 * 14).parse(process.env.JWT_MAX_AGE_SECONDS),
  NODE_ENV: process.env.NODE_ENV ?? 'production',
  VERCEL_ENV: process.env.VERCEL_ENV ?? 'production',
};

export const isProd = (env.VERCEL_ENV ?? env.NODE_ENV) === 'production';

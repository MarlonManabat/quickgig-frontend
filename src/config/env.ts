// Edge-safe env helper used by both Node (route handlers) and Edge (middleware).
// Do NOT import "server-only" here; this module is consumed by middleware.

const RUNTIME = process.env.NEXT_RUNTIME ?? 'nodejs';
const isProd = process.env.VERCEL_ENV === 'production';

export const env = {
  API_URL: process.env.API_URL,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL,
  JWT_COOKIE_NAME: process.env.JWT_COOKIE_NAME ?? 'auth_token',
  JWT_MAX_AGE_SECONDS: process.env.JWT_MAX_AGE_SECONDS ?? '1209600',
  RUNTIME,
  isEdge: RUNTIME === 'edge',
  isNode: RUNTIME !== 'edge',
  isProd,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as Record<string, any> & {
  readonly API_URL?: string;
  readonly NEXT_PUBLIC_API_URL?: string;
  readonly NEXT_PUBLIC_SOCKET_URL?: string;
  readonly JWT_COOKIE_NAME?: string;
  readonly JWT_MAX_AGE_SECONDS?: string;
  readonly RUNTIME: string;
  readonly isEdge: boolean;
  readonly isNode: boolean;
  readonly isProd: boolean;
};

const warned = new Set<string>();

export function requireVar(name: keyof typeof process.env) {
  const key = String(name);
  const value = process.env[key];
  if (value) return value;
  if (env.isProd) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  if (!warned.has(key)) {
    console.warn(`Missing environment variable: ${key}`);
    warned.add(key);
  }
  return undefined;
}


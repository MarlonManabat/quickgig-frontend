// Edge-safe env helper used by both Node (route handlers) and Edge (middleware).
// Do NOT import "server-only" here; this module is consumed by middleware.

const RUNTIME = process.env.NEXT_RUNTIME ?? 'nodejs';

type Env = {
  API_URL?: string;                   // required in production
  NEXT_PUBLIC_API_URL?: string;       // optional, for links/display
  NEXT_PUBLIC_SOCKET_URL?: string;    // optional, sockets disabled if unset
  JWT_COOKIE_NAME?: string;           // optional, defaults to "auth_token"
  JWT_MAX_AGE_SECONDS?: string;       // optional, defaults to 1209600 (14d)
};

const raw: Env = {
  API_URL: process.env.API_URL,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL,
  JWT_COOKIE_NAME: process.env.JWT_COOKIE_NAME ?? 'auth_token',
  JWT_MAX_AGE_SECONDS: process.env.JWT_MAX_AGE_SECONDS ?? '1209600',
};

// In production, fail fast if required server env is missing.
// (Edge or Node runtime – both go through this file.)
if (process.env.NODE_ENV === 'production' && !raw.API_URL) {
  throw new Error('Missing environment variable: API_URL');
}

export const env = {
  ...raw,
  RUNTIME,
  isEdge: RUNTIME === 'edge',
  isNode: RUNTIME !== 'edge',
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
};


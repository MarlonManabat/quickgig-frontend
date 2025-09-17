// Centralized environment access helpers.
// Keep these side-effect free; Next may import them in Edge contexts.

type EnvRecord = Record<string, string | undefined>;

const rawEnv: EnvRecord = typeof process !== 'undefined' ? process.env : {};

const NODE_ENV = rawEnv.NODE_ENV ?? 'development';

export const env = {
  NODE_ENV,
  NEXT_PUBLIC_SUPABASE_URL: rawEnv.NEXT_PUBLIC_SUPABASE_URL ?? '',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: rawEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
};

// Backwards-compat exports for modules that still rely on the old shape.
export const ENV = {
  NODE_ENV,
  APP_ORIGIN: rawEnv.NEXT_PUBLIC_APP_ORIGIN ?? 'http://localhost:3000',
  SUPABASE_URL: env.NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_ANON: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
};

export const IS_PROD = NODE_ENV === 'production';

export function requireServer(key: string): string {
  const value = rawEnv[key];
  if (!value || !value.trim()) {
    throw new Error(`${key} is required`);
  }
  return value;
}

// Minimal, safe env reader that won't crash CI/preview builds,
// but *will* enforce correctness in real production deploys.
export function isVercelProd(): boolean {
  const isVercel = rawEnv.VERCEL === '1' || rawEnv.VERCEL?.toLowerCase() === 'true';
  const isProdEnv = rawEnv.VERCEL_ENV === 'production';
  const isCi = rawEnv.CI === 'true' || rawEnv.CI === '1';
  return Boolean(isVercel && isProdEnv && !isCi);
}

export function apiBaseUrl(): string | undefined {
  const url = rawEnv.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (!url) {
    if (isVercelProd()) {
      throw new Error('NEXT_PUBLIC_API_BASE_URL is required in Vercel production');
    }
    return undefined; // allow empty in CI/preview/local so pages render empty state
  }
  return url.replace(/\/+$/, '');
}

export function appHost(): string | undefined {
  const host = rawEnv.NEXT_PUBLIC_APP_HOST?.trim();
  if (!host) return undefined;
  return host.replace(/\/+$/, '');
}

export function analyticsUrl(): string | undefined {
  const u = rawEnv.NEXT_PUBLIC_ANALYTICS_URL?.trim();
  return u ? u : undefined;
}

function resolveMetadataBase(): string {
  const explicit = rawEnv.NEXT_PUBLIC_HOST_BASE_URL?.trim();
  if (explicit) return explicit;

  const vercel = rawEnv.NEXT_PUBLIC_VERCEL_URL?.trim();
  if (vercel) {
    return vercel.startsWith('http') ? vercel : `https://${vercel}`;
  }

  const site = rawEnv.NEXT_PUBLIC_SITE_URL?.trim();
  if (site) return site;

  return 'http://localhost:4010';
}

export function metadataBaseOrigin(): URL {
  const raw = resolveMetadataBase();
  try {
    return new URL(raw);
  } catch {
    return new URL('http://localhost:4010');
  }
}

// Legacy helper retained for backwards compatibility.
export function getApiBase(): string | null {
  const base = apiBaseUrl();
  return base ?? null;
}

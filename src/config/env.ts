function required(name: string, def?: string) {
  const v = process.env[name] ?? def;
  if (!v) throw new Error(`Missing environment variable: ${name}`);
  return v;
}

function int(name: string, def?: number) {
  const v = process.env[name];
  const n = v ? Number(v) : def;
  if (n == null || Number.isNaN(n)) throw new Error(`Invalid int for environment variable: ${name}`);
  return n;
}

export const env: {
  apiUrl: string;
  publicApiUrl: string;
  socketUrl: string;
  cookieName: string;
  maxAge: number;
  API_URL: string;
  NEXT_PUBLIC_API_URL: string;
  NEXT_PUBLIC_SOCKET_URL: string;
  JWT_COOKIE_NAME: string;
  JWT_MAX_AGE_SECONDS: number;
  NODE_ENV: string;
  VERCEL_ENV: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
} = {
  apiUrl: required('API_URL'),
  publicApiUrl: required('NEXT_PUBLIC_API_URL'),
  socketUrl: required('NEXT_PUBLIC_SOCKET_URL'),
  cookieName: required('JWT_COOKIE_NAME', 'gg_session'),
  maxAge: int('JWT_MAX_AGE_SECONDS', 60 * 60 * 24 * 14),
  API_URL: required('API_URL'),
  NEXT_PUBLIC_API_URL: required('NEXT_PUBLIC_API_URL'),
  NEXT_PUBLIC_SOCKET_URL: required('NEXT_PUBLIC_SOCKET_URL'),
  JWT_COOKIE_NAME: required('JWT_COOKIE_NAME', 'gg_session'),
  JWT_MAX_AGE_SECONDS: int('JWT_MAX_AGE_SECONDS', 60 * 60 * 24 * 14),
  NODE_ENV: process.env.NODE_ENV ?? 'production',
  VERCEL_ENV: process.env.VERCEL_ENV ?? 'production',
};

export const isProd = (env.VERCEL_ENV ?? env.NODE_ENV) === 'production';

const get = (k: string) => process.env[k];

export const env: {
  apiUrl: string;
  publicApiUrl: string;
  socketUrl: string;
  cookieName: string;
  maxAge: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
} = {
  ...process.env,
  apiUrl: get('API_URL')!,
  publicApiUrl: get('NEXT_PUBLIC_API_URL')!,
  socketUrl: get('NEXT_PUBLIC_SOCKET_URL') ?? '',
  cookieName: get('JWT_COOKIE_NAME') ?? 'gg_session',
  maxAge: Number(get('JWT_MAX_AGE_SECONDS') ?? 1209600),
};

export const isProd = (env.VERCEL_ENV ?? env.NODE_ENV) === 'production';


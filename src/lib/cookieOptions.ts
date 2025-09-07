const DEFAULT_DOMAIN = process.env.NEXT_PUBLIC_COOKIE_DOMAIN
  || process.env.COOKIE_DOMAIN
  || '.quickgig.ph';

export const crossSiteCookieOpts = {
  httpOnly: true as const,
  secure: true as const,
  sameSite: 'lax' as const,
  path: '/' as const,
  domain: DEFAULT_DOMAIN,
};

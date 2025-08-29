export const APP_BASE =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, '') || 'https://app.quickgig.ph';

export const appHref = (path = '/') =>
  `${APP_BASE}${path.startsWith('/') ? path : `/${path}`}`;

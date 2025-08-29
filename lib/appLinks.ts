const DEFAULT_APP = 'https://app.quickgig.ph';

export const APP_BASE =
  (process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/+$/, '') || DEFAULT_APP;

// Build an ABSOLUTE URL to the app, always
export const appHref = (path = '/'): string => {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${APP_BASE}${p}`;
};

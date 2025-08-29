const rawOrigin = process.env.NEXT_PUBLIC_APP_ORIGIN || 'https://app.quickgig.ph';
let origin = rawOrigin;
while (origin.endsWith('/')) origin = origin.slice(0, -1);
export const APP_ORIGIN = origin;

export const appHref = (path = '/') =>
  `${APP_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`;


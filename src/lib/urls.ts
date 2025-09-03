export const APP_ORIGIN =
  process.env.NEXT_PUBLIC_APP_ORIGIN?.replace(/\/+$/, '') ||
  'https://app.quickgig.ph';

export const appUrl = (path: string = '/') =>
  new URL(path.startsWith('/') ? path : `/${path}`, APP_ORIGIN).toString();

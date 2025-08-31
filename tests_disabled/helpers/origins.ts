export const APP_ORIGIN =
  process.env.NEXT_PUBLIC_APP_ORIGIN?.trim() ||
  'https://app.quickgig.ph';

export function appHref(path: string) {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${APP_ORIGIN}${p}`;
}

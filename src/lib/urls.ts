export function getAppOrigin() {
  // Use explicit var in prod; empty string (relative) in preview/dev
  const env = process.env.VERCEL_ENV || process.env.NODE_ENV;
  const origin =
    process.env.NEXT_PUBLIC_APP_ORIGIN ||
    (env === 'production' ? 'https://app.quickgig.ph' : '');
  return origin;
}

export function toAppPath(path: string) {
  const base = getAppOrigin();
  // ensure single slash joining
  if (!path.startsWith('/')) path = '/' + path;
  return base ? `${base}${path}` : path;
}

export function appOrigin() {
  const explicit = process.env.NEXT_PUBLIC_APP_URL; // e.g. https://app.quickgig.ph
  if (explicit) return explicit.replace(/\/$/, '');

  const env = process.env.NEXT_PUBLIC_VERCEL_ENV; // production | preview | development
  if (env === 'production') return 'https://app.quickgig.ph';
  if (env === 'development') return 'http://localhost:3000';
  // preview: use relative so links stay on the preview origin
  return '';
}

export function appHref(path: string) {
  const base = appOrigin();
  return base ? `${base}${path}` : path;
}

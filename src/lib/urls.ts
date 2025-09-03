const DEFAULT_APP_ORIGIN = 'https://app.quickgig.ph';

export function appOrigin() {
  const env = process.env.NEXT_PUBLIC_APP_ORIGIN?.trim();
  return env && /^https?:\/\//.test(env) ? env.replace(/\/+$/, '') : DEFAULT_APP_ORIGIN;
}

export function appUrl(path: string) {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${appOrigin()}${p}`;
}


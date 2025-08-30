export function getAppOrigin(): string {
  // Prefer public var for client, fallback to APP_ORIGIN if present.
  const fromPublic = process.env.NEXT_PUBLIC_APP_ORIGIN || '';
  const fromBuild  = process.env.APP_ORIGIN || '';
  const origin = (fromPublic || fromBuild || '').trim();
  return origin.replace(/\/+$/, ''); // drop trailing slash
}

export function withAppOrigin(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  const origin = getAppOrigin();
  // If origin is empty (dev preview), still return absolute-ish path so app works locally.
  return origin ? `${origin}${p}`.replace(/([^:]\/)\/+/g, '$1') : p;
}

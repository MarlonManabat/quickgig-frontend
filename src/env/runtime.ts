export const IS_BROWSER = typeof window !== 'undefined';
export const HOST = IS_BROWSER ? window.location.hostname : process.env.NEXT_PUBLIC_VERCEL_URL || '';
export const IS_VERCEL_PREVIEW = /\.vercel\.app$/.test(HOST);
export const ENABLE_SOCKETS = (process.env.NEXT_PUBLIC_ENABLE_SOCKETS ?? 'true') === 'true' && !IS_VERCEL_PREVIEW;
export const IS_LEGACY_ROUTE = () => {
  if (!IS_BROWSER) return false;
  const p = window.location.pathname;
  return p === '/' || p === '/login';
};

import { appHost } from './env';

// Build an absolute, host-aware URL when an app host is configured.
// - Absolute inputs are returned unchanged.
// - Relative inputs are prefixed with NEXT_PUBLIC_APP_HOST (or NEXT_PUBLIC_HOST_BASE_URL).
export function hostAware(path: string): string {
  const base =
    appHost() ?? process.env.NEXT_PUBLIC_HOST_BASE_URL?.replace(/\/+$/, '') ?? process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, '') ?? '';
  if (!base) return path;
  if (/^https?:\/\//i.test(path)) return path;
  const normalised = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalised}`;
}

export function authAware(destPath: string): string {
  const destAbs = hostAware(destPath);
  const next = encodeURIComponent(destAbs);
  return hostAware(`/login?next=${next}`);
}


// Build an absolute, host-aware URL when an app host is configured.
// - Absolute inputs are returned unchanged.
// - Relative inputs are prefixed with NEXT_PUBLIC_APP_HOST (or NEXT_PUBLIC_HOST_BASE_URL).
export function hostAware(urlOrPath: string): string {
  const base =
    process.env.NEXT_PUBLIC_APP_HOST ?? process.env.NEXT_PUBLIC_HOST_BASE_URL;
  if (!base) return urlOrPath;
  // Absolute already? leave untouched
  try {
    // eslint-disable-next-line no-new
    new URL(urlOrPath);
    return urlOrPath;
  } catch {
    const root = base.replace(/\/$/, "");
    const path = urlOrPath.startsWith("/") ? urlOrPath : `/${urlOrPath}`;
    return `${root}${path}`;
  }
}


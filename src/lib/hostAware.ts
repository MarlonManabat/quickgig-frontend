const APP_HOST = process.env.NEXT_PUBLIC_APP_HOST_BASE_URL || process.env.NEXT_PUBLIC_APP_BASE_URL;
/**
 * Builds an absolute URL to the App Host when configured, else returns the given path.
 * Examples:
 *   hostAware('/gigs/create') -> 'https://app.example.com/gigs/create' | '/gigs/create'
 */
export function hostAware(path: string) {
  if (!APP_HOST) return path;
  try {
    return new URL(path, APP_HOST).toString();
  } catch {
    return path;
  }
}

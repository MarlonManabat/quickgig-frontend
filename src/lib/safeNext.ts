import { ROUTES } from '@/lib/routes';

export function sanitizeNext(raw: string | undefined | null): string {
  if (!raw) return ROUTES.applications;
  try {
    const dec = decodeURIComponent(raw);
    // allow only same-site paths
    if (dec.startsWith('/') && !dec.startsWith('//') && !dec.includes('://')) return dec || ROUTES.applications;
  } catch {
    /* noop */
  }
  return ROUTES.applications;
}

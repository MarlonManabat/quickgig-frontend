export function sanitizeNext(raw: string | undefined | null): string {
  if (!raw) return '/applications';
  try {
    const dec = decodeURIComponent(raw);
    if (dec.startsWith('/') && !dec.startsWith('//') && !dec.includes('://')) {
      return dec;
    }
  } catch {
    /* ignore */
  }
  return '/applications';
}

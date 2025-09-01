export function safeNext(raw?: string | null): string | null {
  if (!raw) return null;
  try {
    // allow only absolute paths on same origin ("/...", no scheme, no "//host")
    if (raw.startsWith('/') && !raw.startsWith('//')) return raw;
  } catch {}
  return null;
}

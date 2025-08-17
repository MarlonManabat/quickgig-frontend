export function legacyFlagFromEnv(): boolean {
  return String(process.env.NEXT_PUBLIC_LEGACY_UI || '').toLowerCase() === 'true';
}
export function legacyFlagFromQuery(params: URLSearchParams | null | undefined): boolean {
  try { return !!params && (params.get('legacy') === '1'); } catch { return false; }
}

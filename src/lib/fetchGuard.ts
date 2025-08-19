export function guardAgainstPhpOrigin(url: string) {
  if (typeof window === 'undefined' || process.env.NODE_ENV === 'production') return;
  try {
    const u = new URL(url, window.location.origin);
    const isCross = u.origin !== window.location.origin;
    if (isCross && u.pathname.endsWith('.php')) {
      // eslint-disable-next-line no-console
      console.error(
        '[auth-guard] Blocked cross-origin PHP call in browser:',
        u.toString(),
        '→ use /api/session/* same-origin proxy instead.'
      );
    }
  } catch {
    // ignore
  }
}

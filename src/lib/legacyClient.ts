export function legacyEnabled(): boolean {
  try {
    const qp = new URL(window.location.href).searchParams.get('legacy') === '1';
    const env = String(process.env.NEXT_PUBLIC_LEGACY_UI || '').toLowerCase() === 'true';
    return qp || env;
  } catch {
    return String(process.env.NEXT_PUBLIC_LEGACY_UI || '').toLowerCase() === 'true';
  }
}

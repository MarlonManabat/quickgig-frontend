export function getAppRoot(): string {
  const raw = process.env.NEXT_PUBLIC_APP_URL?.trim() || '';
  // Strip query/hash
  const noFrag = raw.split('#')[0].split('?')[0];
  // Remove any trailing slash
  const trimmed = noFrag.replace(/\/+$/, '');
  // Remove any accidental path (we want pure origin)
  try {
    const u = new URL(trimmed);
    return `${u.protocol}//${u.host}`;
  } catch {
    return 'https://app.quickgig.ph';
  }
}

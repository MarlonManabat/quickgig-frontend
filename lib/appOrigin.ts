export function resolveAppOrigin() {
  // Explicit env wins (set in Vercel for prod)
  if (process.env.NEXT_PUBLIC_APP_ORIGIN) return process.env.NEXT_PUBLIC_APP_ORIGIN;

  // Guess: if we're on landing host, prefer app.<host>; otherwise same origin
  if (typeof window !== 'undefined') {
    const { protocol, hostname, port } = window.location;
    const guess = hostname.startsWith('app.')
      ? `${protocol}//${hostname}${port ? ':' + port : ''}`
      : `${protocol}//app.${hostname}${port ? ':' + port : ''}`;
    return guess;
  }

  // SSR/CI fallback
  return 'https://app.quickgig.ph';
}

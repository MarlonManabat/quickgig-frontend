export function getStubRole(): 'admin'|'employer'|'worker'|null {
  if (process.env.VERCEL_ENV !== 'preview' && process.env.CI !== 'true') return null;
  if (typeof document === 'undefined') return null;
  const m = document.cookie.match(/(?:^|;\s*)qg_test_role=([^;]+)/);
  return (m?.[1] as any) || null;
}

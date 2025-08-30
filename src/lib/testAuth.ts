export function getStubRole(): 'admin'|'employer'|'worker'|null {
  if (process.env.E2E_STUB !== '1') return null;
  if (typeof document !== 'undefined') {
    const m = document.cookie.match(/(?:^|;\s*)qg_role=([^;]+)/);
    return (m?.[1] as any) || null;
  }
  return null;
}

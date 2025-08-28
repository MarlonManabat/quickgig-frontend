export function getStubRole(): 'admin'|'employer'|'worker'|null {
  if (process.env.NODE_ENV === 'production') return null;
  if (typeof document === 'undefined') return null;
  const m = document.cookie.match(/(?:^|;\s*)qa_role=([^;]+)/);
  return (m?.[1] as any) || null;
}

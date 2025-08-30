// utils/errors.ts
export type SupaErr = { code?: string; message?: string } | null | undefined;

export function isAccessDenied(err: SupaErr): boolean {
  if (!err) return false;
  const code = (err as any).code as string | undefined;
  const msg = (err as any).message as string | undefined;

  // Common PostgREST / PG codes for RLS / permission problems
  // PGRST116: No rows found or not authorized due to RLS (varies by op)
  // 42501: insufficient_privilege (Postgres)
  if (code === "PGRST116" || code === "42501") return true;

  return (
    !!msg &&
    /row[- ]level security|rls|permission|not authorized|not allowed/i.test(msg)
  );
}

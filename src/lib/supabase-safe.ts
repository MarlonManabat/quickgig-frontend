// A tiny wrapper that swallows Supabase errors and returns [] by default.
// Accepts either a PostgrestFilterBuilder (thenable) or a Promise.

export type SupaResult<T> = { data: T | null; error: any };

export async function safeSelect<T = any[]>(
  q: Promise<SupaResult<T>> | { then: (...args: any[]) => any }
): Promise<T extends any[] ? T : T | []> {
  try {
    const { data, error } = await (q as any);
    if (error) return ([] as unknown) as any;
    return (data ?? ([] as unknown)) as any;
  } catch {
    return ([] as unknown) as any;
  }
}

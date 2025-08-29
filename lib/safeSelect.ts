export async function safeSelect<T>(
  q: Promise<{ data: T | null; error: any }>
): Promise<T> {
  try {
    const { data, error } = await q;
    if (error) return [] as any;
    return (data as any) ?? ([] as any);
  } catch {
    return [] as any;
  }
}

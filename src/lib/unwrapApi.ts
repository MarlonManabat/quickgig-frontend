export async function unwrapApi<T>(res: Response): Promise<T> {
  const json: unknown = await res.json().catch(() => null);
  if (json && typeof json === 'object' && 'data' in (json as Record<string, unknown>)) {
    return (json as Record<string, unknown>).data as T;
  }
  return (json as T) ?? ({} as T);
}

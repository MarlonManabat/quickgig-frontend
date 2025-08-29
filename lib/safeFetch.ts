export async function safeJson<T>(path: string, fallback: T): Promise<T> {
  const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';
  try {
    const res = await fetch(`${BASE}${path}`, { cache: 'force-cache' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as T;
  } catch (e) {
    console.error('safeJson fallback:', path, e);
    return fallback;
  }
}

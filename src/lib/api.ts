const publicBase = process.env.NEXT_PUBLIC_API_URL!;
const serverBase = process.env.API_BASE_URL || publicBase;
export const apiBase = typeof window === 'undefined' ? serverBase : publicBase;
export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${apiBase}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    ...init,
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`);
  return res.json() as Promise<T>;
}

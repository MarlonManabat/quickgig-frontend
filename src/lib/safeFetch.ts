export async function safeFetch(url: string, init?: RequestInit) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(url, { ...init, signal: controller.signal });
    let json: unknown = null;
    try { json = await res.json(); } catch {}
    return { ok: res.ok, status: res.status, json, error: null as string | null };
  } catch (e) {
    const message = (e as Error).message || String(e);
    return { ok: false, status: 0, json: null, error: message };
  } finally {
    clearTimeout(t);
  }
}

import { apiOrigin, cookieStrategy, engineMode, apiOriginOk } from './flags';
import { toast } from './toast';

export async function fetchJson<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  if (!apiOriginOk) {
    const msg = 'API unavailable. Check NEXT_PUBLIC_API_URL';
    toast(msg);
    throw new Error(msg);
  }
  const url = apiOrigin + path;
  let attempt = 0;
  let delay = 300;
  for (;;) {
    try {
      const res = await fetch(url, { ...init, credentials: cookieStrategy });
      if (!res.ok) {
        const err = new Error(res.statusText) as Error & { status?: number };
        err.status = res.status;
        if (res.status >= 400 && res.status < 500) throw err;
        throw err;
      }
      return (await res.json().catch(() => ({}))) as T;
    } catch (err) {
      attempt += 1;
      const status = (err as { status?: number } | undefined)?.status;
      if (status && status >= 400 && status < 500) throw err;
      if (attempt >= 3) {
        toast(`${path} (${engineMode}) – CORS/preflight/SSL`);
        throw err;
      }
      await new Promise((r) => setTimeout(r, delay));
      delay *= 2;
    }
  }
}

export type SessionState = { ok: boolean; user?: unknown; status: number };
export async function fetchSession(): Promise<SessionState> {
  try {
    const res = await fetch('/api/session/me', { credentials: 'include', cache: 'no-store' });
    if (res.status === 401) return { ok: false, status: 401 };
    if (!res.ok) return { ok: false, status: res.status };
    return { ok: true, user: await res.json(), status: 200 };
  } catch {
    return { ok: false, status: 0 };
  }
}

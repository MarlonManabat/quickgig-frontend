export type SessionState = { ok: boolean; user?: unknown; status: number };
export async function fetchSession(): Promise<SessionState> {
  try {
    const res = await fetch('/api/session/me', {
      credentials: 'include',
      cache: 'no-store',
    });
    if (!res.ok) return { ok: false, status: res.status };
    const data = (await res.json().catch(() => ({}))) as {
      authenticated?: boolean;
      profile?: unknown;
    };
    if (!data.authenticated) return { ok: false, status: res.status };
    return { ok: true, user: data.profile, status: res.status };
  } catch {
    return { ok: false, status: 0 };
  }
}

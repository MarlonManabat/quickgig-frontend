export async function login(
  payload: URLSearchParams | Record<string, string>
) {
  const body =
    payload instanceof URLSearchParams ? payload : new URLSearchParams(payload as Record<string, string>);

  const res = await fetch('/api/session/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
    credentials: 'include',
  });
  if (!res.ok) throw new Error(`Login failed: ${res.status}`);
  return res;
}

export async function register(
  payload: URLSearchParams | Record<string, string>
) {
  const body =
    payload instanceof URLSearchParams ? payload : new URLSearchParams(payload as Record<string, string>);

  const res = await fetch('/api/session/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
    credentials: 'include',
  });
  if (!res.ok) throw new Error(`Register failed: ${res.status}`);
  return res;
}

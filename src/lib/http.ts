export function copySetCookie(from: Response, toInit?: ResponseInit): ResponseInit {
  const headers = new Headers(toInit?.headers);
  const sc =
    (from.headers as unknown as { getSetCookie?: () => string[] }).getSetCookie?.() ??
    from.headers.get('set-cookie');
  if (Array.isArray(sc)) sc.forEach(v => headers.append('set-cookie', v));
  else if (sc) headers.set('set-cookie', sc);
  return { ...toInit, headers };
}

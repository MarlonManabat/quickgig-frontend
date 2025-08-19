export async function proxyFetch(
  url: string,
  init: RequestInit & { timeoutMs?: number } = {},
) {
  const { timeoutMs = 10000, ...rest } = init;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...rest, signal: controller.signal });
  } finally {
    clearTimeout(id);
  }
}

export function cloneHeaders(h: HeadersInit | undefined): Headers {
  const out = new Headers();
  if (!h) return out;
  if (h instanceof Headers) {
    h.forEach((v, k) => out.set(k, v));
    return out;
  }
  Object.entries(h).forEach(([k, v]) => out.set(k, String(v)));
  return out;
}

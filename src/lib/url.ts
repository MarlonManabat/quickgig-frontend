export function getAppOrigin(): string {
  const fromPublic = process.env.NEXT_PUBLIC_APP_ORIGIN || "";
  const fromBuild  = process.env.APP_ORIGIN || "";
  const fallback   = "https://app.quickgig.ph"; // env-proof fallback
  let raw = (fromPublic || fromBuild || fallback).trim();
  if (raw && !/^https?:\/\//i.test(raw)) raw = `https://${raw}`;
  return raw.replace(/\/+$/, "");
}

export function withAppOrigin(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  const origin = getAppOrigin();
  return `${origin}${p}`.replace(/([^:]\/)\/+/g, "$1");
}

// Small helper to build URLs while preserving/sanitizing query params.
export function withParams(
  basePath: string,
  params: Record<string, string | number | boolean | undefined | null>,
  preserve: URLSearchParams | null = null
): string {
  const url = new URL(basePath, "http://local"); // base irrelevant; we only need search
  const out = new URLSearchParams(preserve ?? undefined);
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") out.delete(k);
    else out.set(k, String(v));
  });
  url.search = out.toString();
  // Return path + search only
  return url.pathname + (out.toString() ? `?${out.toString()}` : "");
}

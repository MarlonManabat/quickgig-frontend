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

export function apiUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_APP_ORIGIN || process.env.APP_ORIGIN || "";
  if (!base) {
    throw new Error("API base URL is not configured");
  }
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`.replace(/([^:]\/)\/+/g, "$1");
}

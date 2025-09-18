import type { ReadonlyURLSearchParams } from "next/navigation";

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
// Small URL helpers that are safe with Next.js ReadonlyURLSearchParams
export type PlainParams = Record<string, string | number | boolean | undefined | null>;

/** Keep only whitelisted keys from a ReadonlyURLSearchParams. */
export function keepParams(
  sp: ReadonlyURLSearchParams,
  allow: string[],
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of sp.entries()) {
    if (allow.includes(k)) out[k] = v;
  }
  return out;
}

/** Build a path + query string from plain params (strings only). */
export function withParams(path: string, params: PlainParams): string {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null) continue;
    // Skip falsey booleans but allow true as a flag (e.g., ?foo=1)
    if (typeof v === "boolean") {
      if (!v) continue;
      qs.set(k, "1");
      continue;
    }
    qs.set(k, String(v));
  }
  const s = qs.toString();
  return s ? `${path}?${s}` : path;
}

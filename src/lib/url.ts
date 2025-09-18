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

/** Keep only whitelisted keys from a ReadonlyURLSearchParams. */
const DEFAULT_ALLOWED_PARAMS = ["q", "location", "sort", "page", "pageSize", "applied"] as const;

export function keepParams(
  sp: ReadonlyURLSearchParams,
  allow: string[] = [...DEFAULT_ALLOWED_PARAMS],
): Partial<Record<string, string>> {
  const allowSet = new Set(allow);
  const out: Partial<Record<string, string>> = {};
  for (const [k, v] of sp.entries()) {
    if (allowSet.has(k)) out[k] = v;
  }
  return out;
}

// Safer query-string builder that only serializes primitives.
export function withParams(path: string, params: Record<string, unknown> = {}) {
  const usp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null) continue;
    // Avoid Symbols/objects creeping in from accidental spreads
    const val = typeof v === "string" || typeof v === "number" || typeof v === "boolean"
      ? String(v)
      : Array.isArray(v)
        ? v.map((x) => String(x)).join(",")
        : undefined;
    if (val && val.trim() !== "") usp.set(k, val);
  }
  const q = usp.toString();
  return q ? `${path}?${q}` : path;
}

import { headers } from "next/headers";

/**
 * Build an absolute URL for a given path (e.g. "/api/applications").
 * - Uses NEXT_PUBLIC_APP_ORIGIN when provided (Vercel Project Env)
 * - Otherwise derives from request headers (host + proto)
 * - Falls back to localhost in dev
 */
export function apiUrl(path: string) {
  const clean = path.startsWith("/") ? path : `/${path}`;

  // If running in a browser, a relative path is fine.
  if (typeof window !== "undefined") return clean;

  // Prefer explicit origin if set (works great on Vercel)
  const explicit =
    process.env.NEXT_PUBLIC_APP_ORIGIN ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);

  if (explicit) return `${explicit}${clean}`;

  // Derive from incoming request (server runtime)
  const h = headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  if (host) return `${proto}://${host}${clean}`;

  // Final fallback (local dev)
  return `http://localhost:3000${clean}`;
}

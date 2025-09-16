// Shared constants for auth/session behavior.
// Safe to import from both edge and server contexts.
export const AUTH_COOKIE = "qg_auth";

export const LEGACY_AUTH_COOKIE_CANDIDATES = [
  "auth",
  "session",
  "next-auth.session-token",
  "sb:token",
  "sb-access-token",
  "sb-refresh-token",
  "qg_next",
] as const;

export const AUTH_COOKIE_NAMES = [
  AUTH_COOKIE,
  ...LEGACY_AUTH_COOKIE_CANDIDATES,
] as const;

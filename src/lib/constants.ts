// Shared constants for auth/session behavior.
// Safe to import from both edge and server contexts.
export const AUTH_COOKIE = "qg_auth";

// Known cookies that actually represent an authenticated session.
// Do **not** include transient cookies (like redirect pointers).
export const LEGACY_AUTH_COOKIE_CANDIDATES = [
  "auth",
  "session",
  "next-auth.session-token",
  "sb:token",
  "sb-access-token",
  "sb-refresh-token",
] as const;

export const AUTH_COOKIE_NAMES = [
  AUTH_COOKIE,
  ...LEGACY_AUTH_COOKIE_CANDIDATES,
] as const;

// Return-path pointer used during login redirects.
// This must NEVER be treated as an auth cookie.
export const NEXT_COOKIE = "qg_next" as const;

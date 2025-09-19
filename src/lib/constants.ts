// Shared constants for auth/session behavior.
// Safe to import from both edge and server contexts.
export const AUTH_COOKIE = "qg_auth" as const;

// Return-path pointer used during login redirects.
// This must NEVER be treated as an auth cookie.
export const NEXT_COOKIE = "qg_next" as const;

// Known cookies that actually represent an authenticated session.
// Only the real auth cookie should ever mark a user as signed in.
export const AUTH_COOKIE_NAMES = [AUTH_COOKIE] as const;

// Keep legacy values ONLY for clearing, not for auth detection.
export const LEGACY_AUTH_COOKIE_CANDIDATES = [
  "auth",
  "session",
  "next-auth.session-token",
  "sb:token",
  "sb-access-token",
  "sb-refresh-token",
  NEXT_COOKIE,
] as const;

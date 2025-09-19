// Shared constants for auth/session behavior.
// Safe to import from both edge and server contexts.
export const AUTH_COOKIE = "qg_auth" as const;

// Return-path pointer used during login redirects.
// This must NEVER be treated as an auth cookie.
export const NEXT_COOKIE = "qg_next" as const;

// Known cookies that actually represent an authenticated session.
// Only the real auth cookie should ever mark a user as signed in.
export const LEGACY_AUTH_COOKIE_CANDIDATES = [
  "auth",
  "session",
  "next-auth.session-token",
  "sb:token",
  "sb-access-token",
  "sb-refresh-token",
  NEXT_COOKIE,
] as const;

export const AUTH_COOKIE_NAMES = [
  AUTH_COOKIE,
  ...LEGACY_AUTH_COOKIE_CANDIDATES,
] as const;

/**
 * Cookie used to store the list of job ids the user has applied to.
 * We purposefully keep this separate from auth to support the demo user.
 */
export const APPLICATIONS_COOKIE = "gg_apps" as const;

/** Max number of job ids we persist to avoid cookie bloat. */
export const APPLICATIONS_MAX = 200;

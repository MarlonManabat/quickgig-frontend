import { NextResponse } from 'next/server';

type Session = { user?: { id: string } } | null;

/**
 * Get a trustworthy origin to build absolute URLs.
 * Uses request headers first (works on Vercel), falls back to APP_ORIGIN.
 */
export function getOrigin(request: Request): string {
  const url = new URL(request.url);
  const hdr = (name: string) => request.headers.get(name) || '';
  const proto = hdr('x-forwarded-proto') || url.protocol.replace(':', '');
  const host = hdr('x-forwarded-host') || hdr('host') || url.host;
  return `${proto}://${host}`;
}

/**
 * Strictly validate the `next` parameter to avoid open redirects.
 * Allowed:
 *   - Empty/undefined → "/"
 *   - A same-origin path starting with "/" and not with "//"
 *   - Optionally: a whitelisted subset of internal routes (see allowlist)
 */
export function sanitizeNext(next?: string | null): string {
  if (!next) return '/';

  // Must start with a single "/" and not look like "//host" or "/\\"
  if (!next.startsWith('/') || next.startsWith('//') || next.startsWith('/\\')) {
    return '/';
  }

  // Normalize basic dot-segments
  try {
    const normalized = new URL(next, 'http://localhost').pathname || '/';
    // Minimal allowlist to prevent weird paths; broaden as needed
    const allow = ['/', '/browse-jobs', '/applications', '/gigs/create'];
    if (
      allow.some((a) => normalized === a) ||
      /^\/jobs\/[A-Za-z0-9\-\._]+$/.test(normalized)
    ) {
      return normalized;
    }
  } catch {
    /* ignore and fall through */
  }
  return '/';
}

/** Build a safe absolute redirect to a sanitized internal path. */
export function buildRedirect(request: Request, next?: string | null): URL {
  const origin =
    getOrigin(request) || process.env.NEXT_PUBLIC_APP_ORIGIN || 'http://localhost:3000';
  const path = sanitizeNext(next);
  return new URL(path, origin);
}

/** Example: used by login handlers to redirect back safely. */
export function buildLoginResponse(request: Request, _session: Session, next?: string) {
  const url = buildRedirect(request, next);
  return NextResponse.redirect(url);
}

/** Example: used by logout handlers. */
export function buildLogoutResponse(request: Request, next?: string) {
  const url = buildRedirect(request, next);
  return NextResponse.redirect(url);
}

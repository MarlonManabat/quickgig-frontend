import { NextRequest, NextResponse } from 'next/server';
import { pkceEnabled, hasPkceConfig } from '@/lib/auth/env';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const next = url.searchParams.get('next') || '/';

  // Disable PKCE on PR/Preview or when config is missing
  if (!pkceEnabled || !hasPkceConfig()) {
    const login = new URL(`/login?next=${encodeURIComponent(next)}`, url.origin);
    return NextResponse.redirect(login, 302);
  }

  // ... existing PKCE logic (unchanged) ...
  return NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(next)}`, url.origin), 302);
}

import { randomUUID } from 'node:crypto';

import { buildLoginResponse } from '@/lib/auth-responses';
import type { Session } from '@/lib/auth';

const AUTH_COOKIE = 'qg_auth';

function resolveSession(roleParam: string | null): Session {
  const role = roleParam === 'employer' ? 'employer' : 'worker';
  return {
    userId: `demo-${role}-${randomUUID()}`,
    role,
  };
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  const next = url.searchParams.get('next') ?? '/browse-jobs';
  const role = url.searchParams.get('role');
  const session = resolveSession(role);
  const response = buildLoginResponse(request, session, next);
  response.cookies.set(AUTH_COOKIE, JSON.stringify(session), {
    path: '/',
    httpOnly: false,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24,
  });
  return response;
}

export async function GET(request: Request) {
  return POST(request);
}

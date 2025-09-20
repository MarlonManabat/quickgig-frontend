import { randomUUID } from 'node:crypto';

import { buildLoginResponse } from '@/lib/auth-responses';
import type { Session } from '@/lib/auth';

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
  return buildLoginResponse(request, session, next);
}

export async function GET(request: Request) {
  return POST(request);
}

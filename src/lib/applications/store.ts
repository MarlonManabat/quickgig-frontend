import 'server-only';

export class ForbiddenError extends Error {}
export class NotFoundError extends Error {}
export class BadRequestError extends Error {}

export type ApplicationRecord = {
  id: string;
  status: 'pending' | 'approved' | 'rejected' | 'withdrawn';
  uid: string;
};

const memoryStore = new Map<string, ApplicationRecord>();
let logged = false;

function logOnce() {
  if (!logged) {
    console.log('[applications] using in-memory store');
    logged = true;
  }
}

export async function withdrawApplication({
  id,
  uid,
}: {
  id: string;
  uid: string;
}): Promise<{ ok: true; id: string; status: 'withdrawn' }> {
  if (!id) throw new BadRequestError('missing id');
  // TODO: implement Supabase mutation when server creds are available
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    // minimal mock for now
  }

  logOnce();
  const existing = memoryStore.get(id);
  if (existing && existing.uid !== uid) {
    throw new ForbiddenError('not owner');
  }
  const record: ApplicationRecord = existing ?? {
    id,
    status: 'pending',
    uid,
  };
  record.status = 'withdrawn';
  memoryStore.set(id, record);
  return { ok: true as const, id, status: 'withdrawn' as const };
}

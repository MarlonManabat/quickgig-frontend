import 'server-only';

type Status = 'applied' | 'withdrawn' | 'rejected' | 'hired';

export class ForbiddenError extends Error {}
export class NotFoundError extends Error {}
export class BadRequestError extends Error {}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE;

type AppRow = { id: string; candidate_id: string; gig_id: string; status: Status };
type GigRow = { id: string; owner_id: string };

// Minimal in-memory fallback so Preview works with no secrets.
// (Isolated here to avoid touching other mock files.)
const mock = (() => {
  let inited = false;
  const store = new Map<string, { ownerId: string; candidateId: string; status: Status }>();
  return {
    ensure() {
      if (!inited) {
        inited = true;
        console.log('[applications/moderation] using in-memory mock store');
      }
    },
    setSeed(id: string, ownerId: string, candidateId: string, status: Status) {
      store.set(id, { ownerId, candidateId, status });
    },
    get(id: string) { return store.get(id); },
    set(id: string, next: Status) {
      const cur = store.get(id);
      if (!cur) throw new NotFoundError('not found');
      cur.status = next;
      store.set(id, cur);
    }
  };
})();

export async function moderateApplication({
  by,
  id,
  action,
}: {
  by: string;
  id: string;
  action: 'approve' | 'reject';
}): Promise<{ ok: true }> {
  const applicationId = id?.trim();
  if (!applicationId) throw new BadRequestError('invalid_id');

  const nextStatus: Status = action === 'approve' ? 'hired' : 'rejected';

  // If we have service credentials, do a real update with owner check.
  if (SUPABASE_URL && SUPABASE_SERVICE_ROLE) {
    const { createClient } = await import('@supabase/supabase-js');
    const supa = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    // 1) fetch application to learn gig_id
    const { data: app, error: appErr } = await supa
      .from<AppRow>('applications')
      .select('id,candidate_id,gig_id,status')
      .eq('id', applicationId)
      .single();

    if (appErr || !app) throw new NotFoundError('application');

    // 2) fetch gig to verify owner
    const { data: gig, error: gigErr } = await supa
      .from<GigRow>('gigs')
      .select('id,owner_id')
      .eq('id', app.gig_id)
      .single();

    if (gigErr || !gig) throw new NotFoundError('gig');
    if (gig.owner_id !== by) throw new ForbiddenError('not owner');

    // 3) update status
    const { error: updErr, count } = await supa
      .from('applications')
      .update({ status: nextStatus })
      .eq('id', applicationId)
      .eq('gig_id', app.gig_id)
      .select('id', { count: 'exact', head: true });

    if (updErr) throw updErr;
    if (!count) throw new NotFoundError('application');
    return { ok: true } as const;
  }

  // Fallback mock (Preview / local without secrets)
  mock.ensure();
  const row = mock.get(applicationId);
  if (!row) throw new NotFoundError('application');
  // In mock, we also enforce ownership.
  // (Seeded rows should set ownerId to the employer who posted the gig.)
  if (row && by !== row.ownerId) throw new ForbiddenError('not owner');
  mock.set(applicationId, nextStatus);
  return { ok: true } as const;
}


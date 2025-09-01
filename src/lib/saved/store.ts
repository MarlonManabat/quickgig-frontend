import 'server-only';

type GigId = string;
type UserId = string;

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE;

// Simple in-memory fallback for Preview/local without secrets.
const mem = (() => {
  let inited = false;
  const byUser = new Map<UserId, Set<GigId>>();
  return {
    ensure() {
      if (!inited) {
        inited = true;
        console.log('[saved] using in-memory store');
      }
    },
    list(uid: UserId): GigId[] {
      return Array.from(byUser.get(uid) ?? []);
    },
    add(uid: UserId, gid: GigId) {
      const set = byUser.get(uid) ?? new Set<GigId>();
      set.add(gid);
      byUser.set(uid, set);
    },
    remove(uid: UserId, gid: GigId) {
      const set = byUser.get(uid);
      if (!set) return;
      set.delete(gid);
      byUser.set(uid, set);
    },
  };
})();

async function listDb(uid: UserId): Promise<GigId[]> {
  const { createClient } = await import('@supabase/supabase-js');
  const supa = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data, error } = await supa.from('saved_gigs').select('gig_id').eq('user_id', uid);
  if (error) throw error;
  return (data ?? []).map((r: any) => String(r.gig_id));
}

async function addDb(uid: UserId, gid: GigId): Promise<void> {
  const { createClient } = await import('@supabase/supabase-js');
  const supa = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { error } = await supa.from('saved_gigs').upsert({ user_id: uid, gig_id: gid }, { onConflict: 'user_id,gig_id' });
  if (error) throw error;
}

async function removeDb(uid: UserId, gid: GigId): Promise<void> {
  const { createClient } = await import('@supabase/supabase-js');
  const supa = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { error } = await supa.from('saved_gigs').delete().eq('user_id', uid).eq('gig_id', gid);
  if (error) throw error;
}

export async function listSaved({ uid }: { uid: UserId }): Promise<GigId[]> {
  if (SUPABASE_URL && SUPABASE_SERVICE_ROLE) return listDb(uid);
  mem.ensure();
  return mem.list(uid);
}

export async function saveGig({ uid, gigId }: { uid: UserId; gigId: GigId }): Promise<void> {
  if (!gigId) return;
  if (SUPABASE_URL && SUPABASE_SERVICE_ROLE) return addDb(uid, gigId);
  mem.ensure();
  mem.add(uid, gigId);
}

export async function unsaveGig({ uid, gigId }: { uid: UserId; gigId: GigId }): Promise<void> {
  if (!gigId) return;
  if (SUPABASE_URL && SUPABASE_SERVICE_ROLE) return removeDb(uid, gigId);
  mem.ensure();
  mem.remove(uid, gigId);
}

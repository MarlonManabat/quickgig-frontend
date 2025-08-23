import { supabase } from '@/utils/supabaseClient';

export async function getSessionUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user || null;
}

export async function isAdmin() {
  const user = await getSessionUser();
  if (!user) return false;
  const { data } = await supabase.from('profiles')
    .select('is_admin').eq('id', user.id).single();
  return !!data?.is_admin;
}

export async function getAdminStats() {
  // Best-effort counts; if RLS blocks, show 0/“-”
  const tables = ['orders', 'profiles', 'gigs', 'applications'];
  const out: Record<string, { total:number|null; last7:number|null }> = {};
  const since = new Date(Date.now() - 7*24*60*60*1000).toISOString();
  for (const t of tables) {
    let total: number|null = null, last7: number|null = null;
    try {
      const { count: ct } = await supabase.from(t).select('*', { count:'exact', head:true });
      total = ct ?? null;
    } catch {}
    try {
      const { count: c7 } = await supabase.from(t)
        .select('*', { count:'exact', head:true })
        .gte('created_at', since);
      last7 = c7 ?? null;
    } catch {}
    out[t] = { total, last7 };
  }
  return out;
}

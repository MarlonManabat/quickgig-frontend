import 'server-only';
import { userIdFromCookie, getSupabaseServer } from '@/lib/supabase/server';

type Row = {
  id: string;
  gig_id: string;
  gig_title?: string | null;
  status: string;
  created_at: string;
};

export async function applicationsForUser(): Promise<{ items: Row[]; canMutate: boolean; issue?: string }> {
  try {
    const uid = await userIdFromCookie();
    if (!uid) return { items: [], canMutate: false, issue: 'no user session' };

    const supa = getSupabaseServer();

    // Expect RLS to allow selecting own applications
    const { data, error } = await supa
      .from('applications_view') // prefer a view joining gigs for title; fallback handled below
      .select('id, gig_id, gig_title, status, created_at')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error || !data) {
      return { items: mock(uid), canMutate: false, issue: 'query failed or view missing' };
    }
    return { items: data as Row[], canMutate: true };
  } catch (e: any) {
    return { items: [], canMutate: false, issue: e?.message ?? 'unknown' };
  }
}

function mock(uid: string): Row[] {
  const now = new Date().toISOString();
  return [
    { id: 'm1', gig_id: 'g1', gig_title: 'Sample Gig', status: 'submitted', created_at: now },
  ];
}

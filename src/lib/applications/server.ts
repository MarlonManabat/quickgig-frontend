import 'server-only';

import { adminSupabase } from '@/lib/supabase/server';
import {
  mockWithdraw,
  MockNotFoundError,
  MockForbiddenError,
  mockApplicationStore,
} from '@/lib/mock/application-store';

export type ApplicationStatus = 'applied' | 'withdrawn' | 'rejected' | 'hired';

export class NotFoundError extends Error {}
export class ForbiddenError extends Error {}

export async function getApplicationById(id: string) {
  const supa = await adminSupabase();
  if (!supa) {
    return mockApplicationStore.get(id) ?? null;
  }
  const { data, error } = await supa
    .from('applications')
    .select('*')
    .eq('id', id)
    .single();
  if (error) {
    if ((error as any).code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function withdrawApplication(
  uid: string,
  applicationId: string,
): Promise<void> {
  const supa = await adminSupabase();
  if (!supa) {
    try {
      mockWithdraw(uid, applicationId);
      return;
    } catch (err) {
      if (err instanceof MockNotFoundError) throw new NotFoundError();
      if (err instanceof MockForbiddenError) throw new ForbiddenError();
      throw err;
    }
  }

  const { data, error } = await supa
    .from('applications')
    .update({ status: 'withdrawn' })
    .eq('id', applicationId)
    .eq('candidate_id', uid)
    .select('id');

  if (error) throw error;
  if (!data || data.length === 0) {
    const { data: existing, error: fetchError } = await supa
      .from('applications')
      .select('candidate_id')
      .eq('id', applicationId)
      .single();

    if (fetchError || !existing) throw new NotFoundError();
    if (existing.candidate_id !== uid) throw new ForbiddenError();
    throw new NotFoundError();
  }
}

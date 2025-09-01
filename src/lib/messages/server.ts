import 'server-only';

import { adminSupabase } from '@/lib/supabase/server';

export type MessageRow = {
  id: string;
  application_id: string;
  sender_id: string;
  body: string;
  created_at: string;
};

export async function listMessages({
  applicationId,
  after,
  limit,
}: {
  applicationId: string;
  after?: string;
  limit?: number;
}): Promise<MessageRow[]> {
  const supa = await adminSupabase();
  if (!supa) return [];
  let q = supa
    .from('messages')
    .select('id, application_id, sender_id, body, created_at')
    .eq('application_id', applicationId)
    .order('id', { ascending: true });
  if (after) q = q.gt('id', after);
  if (limit) q = q.limit(limit);
  const { data, error } = await q;
  if (error) return [];
  return (data as MessageRow[]) ?? [];
}

export async function createMessage({
  applicationId,
  senderId,
  body,
}: {
  applicationId: string;
  senderId: string;
  body: string;
}): Promise<MessageRow | null> {
  const supa = await adminSupabase();
  if (!supa) return null;
  const { data, error } = await supa
    .from('messages')
    .insert({ application_id: applicationId, sender_id: senderId, body })
    .select('id, application_id, sender_id, body, created_at')
    .single();
  if (error) return null;
  return data as MessageRow;
}

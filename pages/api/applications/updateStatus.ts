import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSupabase } from '@/lib/supabase-server';

const allowed = ['accepted', 'declined'];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') return res.status(405).end();
  const supabase = getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return res.status(401).json({ error: { code: 'UNAUTHORIZED' } });

  const { applicationId, status } = req.body || {};
  const fieldErrors: Record<string, string> = {};
  if (!applicationId || typeof applicationId !== 'string')
    fieldErrors.applicationId = 'Application required';
  if (typeof status !== 'string' || !allowed.includes(status))
    fieldErrors.status = 'Invalid status';
  if (Object.keys(fieldErrors).length)
    return res
      .status(400)
      .json({ error: { code: 'VALIDATION_FAILED', fields: fieldErrors } });

  const { data, error } = await supabase
    .from('applications')
    .update({ status })
    .eq('id', applicationId)
    .select('worker_id, job_id')
    .single();
  if (error)
    return res
      .status(400)
      .json({ error: { code: 'DB_ERROR', message: error.message } });

  const { error: notifErr } = await supabase.from('notifications').insert({
    user_id: data!.worker_id,
    type: 'application_status',
    title: 'Application status updated',
    body: `Your application was ${status}.`,
    link: `/applications/${applicationId}`,
  });
  if (notifErr) console.error('notification error', notifErr.message);

  res.status(200).json({ ok: true });
}

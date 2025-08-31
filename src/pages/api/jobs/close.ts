import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSupabase } from '@/lib/supabase-server';
import type { Update } from '@/types/db';

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

  const { jobId } = req.body || {};
  const fieldErrors: Record<string, string> = {};
  if (!jobId || typeof jobId !== 'string')
    fieldErrors.jobId = 'Job required';
  if (Object.keys(fieldErrors).length)
    return res
      .status(400)
      .json({ error: { code: 'VALIDATION_FAILED', fields: fieldErrors } });

  const { error } = await supabase
    .from('jobs')
    .update({ is_closed: true } as Update<'jobs'>)
    .eq('id', jobId)
    .eq('is_closed', false);
  if (error)
    return res
      .status(400)
      .json({ error: { code: 'DB_ERROR', message: error.message } });

  res.status(200).json({ ok: true });
}

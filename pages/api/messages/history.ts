import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSupabase } from '@/lib/credits-server';
import { asString } from '@/lib/normalize';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET')
    return res.status(405).json({ error: { code: 'METHOD_NOT_ALLOWED' } });

  const supabase = await getServerSupabase();
  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser();
  if (authErr || !user)
    return res.status(401).json({ error: { code: 'UNAUTHENTICATED' } });

  const applicationId = asString(req.query.applicationId);
  const cursor = asString(req.query.cursor);
  const limit = Number(asString(req.query.limit)) || 30;
  if (!applicationId)
    return res.status(400).json({ error: { code: 'APPLICATION_REQUIRED' } });

  const { data: app, error: appErr } = await supabase
    .from('applications')
    .select('id, worker_id, job_id')
    .eq('id', applicationId)
    .single<{ id: string; worker_id: string; job_id: string }>();
  if (appErr || !app)
    return res.status(404).json({ error: { code: 'APPLICATION_NOT_FOUND' } });

  let query = supabase
    .from('messages')
    .select('id, sender_id, body, created_at')
    .eq('application_id', app.id)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (cursor) query = query.lt('created_at', cursor);

  const { data: msgs, error: msgsErr } = await query;
  if (msgsErr)
    return res
      .status(500)
      .json({ error: { code: 'MESSAGES_FETCH_FAILED' } });

  return res.json({ items: (msgs || []).reverse() });
}


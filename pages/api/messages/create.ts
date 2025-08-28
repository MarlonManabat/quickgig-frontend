import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSupabase } from '@/lib/supabase-server';

const WINDOW_MS = 60 * 1000;
const LIMIT = 15;
const hits: Record<string, number[]> = {};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const supabase = getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return res.status(401).json({ error: { code: 'UNAUTHORIZED' } });

  const { applicationId, body } = req.body || {};
  const fieldErrors: Record<string, string> = {};
  if (!applicationId || typeof applicationId !== 'string')
    fieldErrors.applicationId = 'applicationId required';
  const text = typeof body === 'string' ? body.trim() : '';
  if (text.length < 1 || text.length > 4000)
    fieldErrors.body = 'Message length 1-4000';
  if (Object.keys(fieldErrors).length)
    return res
      .status(400)
      .json({ error: { code: 'VALIDATION_FAILED', fields: fieldErrors } });

  const now = Date.now();
  const arr = hits[user.id] || (hits[user.id] = []);
  while (arr.length && now - arr[0] > WINDOW_MS) arr.shift();
  if (arr.length >= LIMIT)
    return res.status(429).json({ error: { code: 'RATE_LIMITED' } });
  arr.push(now);

  const { data, error } = await supabase
    .from('messages')
    .insert({
      application_id: applicationId,
      sender_id: user.id,
      body: text,
    })
    .select('id')
    .single();
  if (error)
    return res.status(400).json({ error: { code: 'DB_ERROR', message: error.message } });
  const msgId = data.id;

  const { data: app } = await supabase
    .from('applications')
    .select('worker_id, job:jobs(title,employer_id)')
    .eq('id', applicationId)
    .maybeSingle();
  const other =
    app?.worker_id === user.id ? app?.job?.employer_id : app?.worker_id;
  if (other) {
    await supabase.from('notifications').insert({
      user_id: other,
      type: 'message_new',
      title: `New message about ${app?.job?.title || 'a job'}`,
      body: text.slice(0, 80),
      link: `/applications/${applicationId}`,
    });
  }

  res.status(201).json({ id: msgId });
}
